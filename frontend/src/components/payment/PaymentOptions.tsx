import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import { INITIATE_PAYMENT, VERIFY_PAYMENT } from '../../gql/mutations/payments';
import { GET_CANTEEN_MERCHANT } from '../../gql/queries/canteens';
declare global {
  interface Window {
    Razorpay: any;
  }
}

type PaymentMethod = 'upi' | 'wallet' | 'cash' | 'payLater';

interface PaymentOptionsProps {
  totalAmount: number;
  orderId: string;
  userId: string;
  canteenId: string;
  onPaymentComplete: (method: string, status: string) => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  totalAmount, 
  orderId, 
  userId, 
  canteenId, 
  onPaymentComplete 
}) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [saveForLater, setSaveForLater] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // GraphQL hooks for payment operations
  const [initiatePayment] = useMutation(INITIATE_PAYMENT);
  const [verifyPayment] = useMutation(VERIFY_PAYMENT);
  
  // Fetch merchant details for the canteen
  const { data: merchantData, loading: merchantLoading } = useQuery(GET_CANTEEN_MERCHANT, {
    variables: { canteenId },
    skip: !canteenId
  });

  const handlePayNow = () => {
    setIsPaymentDialogOpen(true);
    setPaymentError(null);
  };

  const handlePaymentCancel = () => {
    setIsPaymentDialogOpen(false);
    setIsPaymentSuccess(false);
    setPaymentError(null);
  };

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePaymentSubmit = async () => {
    try {
      setIsProcessing(true);
      setPaymentError(null);
      
      if (selectedMethod === 'upi') {
        // Get merchant ID from query
        const merchantId = merchantData?.getCanteenMerchant?.id;
        if (!merchantId) {
          throw new Error("Merchant details not available");
        }
        
        // 1. Initiate payment on the server
        const { data } = await initiatePayment({
          variables: {
            input: {
              orderId,
              userId,
              paymentMethod: selectedMethod,
              merchantId
            }
          }
        });
        
        if (!data?.initiatePayment?.razorpay_order_id) {
          throw new Error("Failed to initialize payment");
        }
        
        // 2. Load Razorpay script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error("Failed to load payment gateway");
        }
        
        // 3. Configure Razorpay
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_ID", // Replace with your actual key
          amount: totalAmount * 100, // Amount in paise
          currency: "INR",
          name: "IIIT Smart Canteen",
          description: `Payment for Order #${orderId}`,
          order_id: data.initiatePayment.razorpay_order_id,
          handler: async function(response: any) {
            try {
              // 4. Verify payment
              const result = await verifyPayment({
                variables: {
                  input: {
                    paymentId: data.initiatePayment.payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature
                  }
                }
              });
              
              if (result.data?.verifyPayment?.status === "completed") {
                setIsPaymentSuccess(true);
                setTimeout(() => {
                  setIsPaymentDialogOpen(false);
                  setIsPaymentSuccess(false);
                  onPaymentComplete(selectedMethod, "completed");
                }, 2000);
              } else {
                throw new Error(result.data?.verifyPayment?.message || "Payment verification failed");
              }
            } catch (error: any) {
              setPaymentError(error.message || "Payment verification failed");
              setIsProcessing(false);
            }
          },
          prefill: {
            name: "User", // Should come from user context
            email: "user@iiit.ac.in", // Should come from user context
            contact: "9876543210" // Should come from user context
          },
          theme: {
            color: "#3399cc"
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
              toast("Payment cancelled");
            }
          }
        };
        
        // 5. Open Razorpay checkout
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else if (selectedMethod === 'wallet') {
        // Wallet payment implementation will go here
        // For now, we'll simulate a successful payment
        setTimeout(() => {
          setIsPaymentSuccess(true);
          setTimeout(() => {
            setIsPaymentDialogOpen(false);
            setIsPaymentSuccess(false);
            onPaymentComplete(selectedMethod, "completed");
          }, 2000);
        }, 2000);
      } else if (selectedMethod === 'cash') {
        // Cash payment implementation
        setTimeout(() => {
          setIsPaymentSuccess(true);
          setTimeout(() => {
            setIsPaymentDialogOpen(false);
            setIsPaymentSuccess(false);
            onPaymentComplete(selectedMethod, "pending");
          }, 2000);
        }, 1000);
      } else if (selectedMethod === 'payLater') {
        // Pay Later implementation will go here
        // For now, we'll simulate a successful payment
        setTimeout(() => {
          setIsPaymentSuccess(true);
          setTimeout(() => {
            setIsPaymentDialogOpen(false);
            setIsPaymentSuccess(false);
            onPaymentComplete(selectedMethod, "completed");
          }, 2000);
        }, 2000);
      }
    } catch (error: any) {
      setIsProcessing(false);
      setPaymentError(error.message || "Payment processing failed");
      toast.error(error.message || "Payment processing failed");
    }
  };

  return (
    <div className="w-full">
      <Button 
        onClick={handlePayNow} 
        className="w-full flex items-center gap-2"
      >
        <CreditCard className="h-4 w-4" />
        Pay Now (₹{totalAmount.toFixed(2)})
      </Button>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {isPaymentSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
              <p className="text-gray-600 text-center mb-6">
                Your payment of ₹{totalAmount.toFixed(2)} has been processed successfully.
              </p>
              <Button onClick={() => setIsPaymentDialogOpen(false)}>
                Continue
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Payment Options</DialogTitle>
                <DialogDescription>
                  Choose your preferred payment method to complete your order.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                {paymentError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                    <div className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                      <p>{paymentError}</p>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <RadioGroup 
                    value={selectedMethod} 
                    onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi">UPI / Card</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem 
                        value="wallet" 
                        id="wallet" 
                        disabled={true} // Disable until implemented
                      />
                      <Label htmlFor="wallet" className={true ? "text-gray-400" : ""}>Wallet (Coming Soon)</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">Cash on Delivery</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem 
                        value="payLater" 
                        id="payLater" 
                        disabled={true} // Disable until implemented
                      />
                      <Label htmlFor="payLater" className={true ? "text-gray-400" : ""}>Pay Later (Coming Soon)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {selectedMethod === 'upi' && (
                  <div className="space-y-4">
                    <div className="rounded-md bg-blue-50 p-3 text-sm flex items-start">
                      <AlertCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                      <p className="text-blue-700">
                        You'll be redirected to Razorpay to complete your payment securely using UPI, credit card, or debit card.
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'wallet' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="walletId">Wallet ID / Mobile Number</Label>
                      <Input 
                        id="walletId" 
                        value={walletId} 
                        onChange={(e) => setWalletId(e.target.value)} 
                        placeholder="Your wallet ID or mobile number"
                      />
                    </div>
                    <div className="rounded-md bg-blue-50 p-3 text-sm flex items-start">
                      <AlertCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                      <p className="text-blue-700">
                        Use your campus wallet balance to pay for orders. Top up your wallet at the canteen counter.
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'cash' && (
                  <div className="rounded-md bg-yellow-50 p-3 text-sm flex items-start">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                    <p className="text-yellow-700">
                      Pay with cash when you pick up your order. Please keep exact change ready.
                    </p>
                  </div>
                )}

                {selectedMethod === 'payLater' && (
                  <div className="rounded-md bg-gray-50 p-4 text-sm">
                    <h3 className="font-medium mb-2">Pay Later Eligibility</h3>
                    <p className="text-gray-600 mb-4">
                      This option is available for faculty members and registered hostel students only. 
                      Your campus ID will be verified.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="campusId">Campus ID</Label>
                      <Input 
                        id="campusId" 
                        placeholder="Enter your campus ID"
                      />
                    </div>
                  </div>
                )}

                {selectedMethod !== 'cash' && (
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox 
                      id="savePayment" 
                      checked={saveForLater}
                      onCheckedChange={(checked) => setSaveForLater(checked as boolean)}
                    />
                    <label
                      htmlFor="savePayment"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Save payment details for future orders
                    </label>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={handlePaymentCancel} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button 
                  onClick={handlePaymentSubmit} 
                  disabled={isProcessing || merchantLoading || (selectedMethod === 'upi' && !merchantData?.getCanteenMerchant?.id)}
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)}`}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentOptions;