import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { Loader2 } from 'lucide-react';
import { paymentService } from '@/services/payment-service';

const TEST_MODE = import.meta.env.DEV || !import.meta.env.PROD;
const TEST_RAZORPAY_KEY_ID = 'rzp_test_1DP5mmOlF5G5ag'; // Razorpay test key
const TEST_MERCHANT_DETAILS = {
  canteen_id: 1,
  name: "Test Canteen",
  razorpay_key_id: TEST_RAZORPAY_KEY_ID,
  razorpay_account_id: "acc_test123456",
  is_active: true
};

interface PaymentOptionsProps {
  amount: number;
  onOrderComplete: (orderId: string) => void;
  canteenId?: number | string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  amount, 
  onOrderComplete,
  canteenId = 1 // Default to canteen ID 1 if not provided
}) => {
  const { toast } = useToast();
  const { clearCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<string>('UPI');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [merchantDetails, setMerchantDetails] = useState<any>(null);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => {
          console.error("Failed to load Razorpay script");
          toast({
            title: "Payment Error",
            description: "Failed to load payment gateway. Please try again later.",
            variant: "destructive"
          });
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
    
    return () => {
      // Cleanup if needed
    };
  }, [toast]);

  // Fetch merchant details based on canteen ID
  useEffect(() => {
    const fetchMerchantData = async () => {
      try {
        setIsLoading(true);
        
        if (TEST_MODE) {
          console.log("Using test merchant details in development mode");
          setMerchantDetails(TEST_MERCHANT_DETAILS);
          return;
        }
        
        const canteenIdNum = typeof canteenId === 'string' ? parseInt(canteenId) : canteenId;
        const data = await paymentService.getMerchantDetails(canteenIdNum);
        
        if (!data || !data.razorpay_key_id) {
          throw new Error("Invalid merchant configuration received");
        }
        
        setMerchantDetails(data);
        console.log("Merchant details loaded successfully:", data);
      } catch (error) {
        console.error("Error fetching merchant data:", error);
        
        // Fall back to test details if request fails
        console.log("Falling back to test merchant details");
        setMerchantDetails(TEST_MERCHANT_DETAILS);
        
        toast({
          title: "Notice",
          description: "Using test payment mode as merchant details couldn't be loaded",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (canteenId) {
      fetchMerchantData();
    }
  }, [canteenId, toast]);

  const handlePayment = async () => {
    if (!merchantDetails) {
      toast({
        title: "Payment Error",
        description: "Payment details not loaded yet. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create order data
      const orderData = {
        amount: Math.round(amount * 100), // Convert to paisa
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        canteenId: merchantDetails.canteen_id
      };
      
      console.log("Creating payment order with:", orderData);
      
      // Create a payment order
      const orderResponse = await paymentService.createPaymentOrder(orderData);
      
      console.log("Payment order response:", orderResponse);
      
      if (!orderResponse || !orderResponse.id) {
        throw new Error("Invalid order response received");
      }
      
      if (window.Razorpay) {
        const options = {
          key: merchantDetails.razorpay_key_id,
          amount: Math.round(amount * 100), // Convert to paisa
          currency: "INR",
          name: "Smart Canteen",
          description: `Order from ${merchantDetails.name}`,
          order_id: orderResponse.id,
          handler: function (response: any) {
            // Verify the payment
            console.log("Payment response:", response);
            paymentService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }).then(() => {
              toast({
                title: "Payment Successful",
                description: "Your payment was successful and your order has been placed.",
              });
              const generatedOrderId = `ORD${Math.floor(100000 + Math.random() * 900000)}`;
              clearCart();
              onOrderComplete(generatedOrderId);
            }).catch((error) => {
              console.error("Payment verification failed:", error);
              toast({
                title: "Payment Verification Failed",
                description: "Your payment was received but could not be verified. Please contact support.",
                variant: "destructive"
              });
            }).finally(() => {
              setIsLoading(false);
            });
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "9999999999",
            method: 'upi'  // Explicitly specify UPI as payment method
          },
          notes: {
            canteen_id: merchantDetails.canteen_id,
            canteen_name: merchantDetails.name,
          },
          theme: {
            color: "#F97316", // Use the canteen orange color
          },
          modal: {
            ondismiss: function() {
              setIsLoading(false);
              toast({
                title: "Payment Cancelled",
                description: "You cancelled the payment process.",
                variant: "default",
              });
            },
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        throw new Error("Razorpay SDK not loaded");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleCashPayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Order Placed!",
        description: "Your cash order has been placed successfully.",
      });
      const generatedOrderId = `ORD${Math.floor(100000 + Math.random() * 900000)}`;
      clearCart();
      onOrderComplete(generatedOrderId);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Method</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className={`p-4 cursor-pointer transition-all ${
            selectedMethod === 'upi' ? 'border-orange-500 bg-orange-50' : ''
          }`}
          onClick={() => setSelectedMethod('upi')}
        >
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mb-2">
              <img src="/upi-icon.png" alt="UPI" className="h-6 w-6" onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23F97316' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='20' height='12' x='2' y='6' rx='2'/%3E%3Cpath d='M22 10H2'/%3E%3C/svg%3E";
              }} />
            </div>
            <div className="text-center">
              <p className="font-medium">UPI</p>
              <p className="text-xs text-gray-500">Pay using any UPI app</p>
            </div>
            <div className="flex items-center justify-center mt-2 gap-1">
              <img src="/gpay-icon.png" alt="GPay" className="h-4" />
              <img src="/phonepe-icon.png" alt="PhonePe" className="h-4" />
              <img src="/paytm-icon.png" alt="Paytm" className="h-4" />
            </div>
          </div>
        </Card>
        <Card 
          className={`cursor-pointer border-2 ${selectedMethod === 'CASH' ? 'border-primary' : 'border-gray-200'}`}
          onClick={() => setSelectedMethod('CASH')}
        >
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <img src="/cash-icon.png" alt="Cash" className="h-12 w-12 mx-auto mb-2" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/48?text=CASH')} />
              <p>Cash on Delivery</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Button 
        className="w-full mt-4" 
        disabled={isLoading || !merchantDetails}
        onClick={selectedMethod === 'UPI' ? handlePayment : handleCashPayment}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ₹${amount.toFixed(2)}`
        )}
      </Button>
    </div>
  );
};

export default PaymentOptions;