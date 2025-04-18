import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { useMutation } from '@apollo/client';
import { INITIATE_PAYMENT, VERIFY_PAYMENT } from '../../gql/mutations/payments';
import { useToast } from '../../hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  orderId: string;
  userId: string;
  merchantId: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  orderId,
  userId,
  merchantId,
  amount,
  onSuccess,
  onError
}) => {
  const { toast } = useToast();
  
  const [initiatePayment, { loading: initiatingPayment }] = useMutation(INITIATE_PAYMENT);
  const [verifyPayment, { loading: verifyingPayment }] = useMutation(VERIFY_PAYMENT);
  
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
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
const handlePayment = async () => {
    try {
      // Initiate payment on server
      const { data } = await initiatePayment({
        variables: {
          input: {
            orderId,
            userId,
            paymentMethod: "upi",
            merchantId
          }
        }
      });
      
      if (!data?.initiatePayment?.razorpay_order_id) {
        onError("Failed to initialize payment");
        return;
      }
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        onError("Failed to load payment gateway");
        return;
      }
      
      // Configure Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay key ID from environment variables
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "IIIT Smart Canteen",
        description: `Payment for Order #${orderId}`,
        order_id: data.initiatePayment.razorpay_order_id,
        handler: async function(response: any) {
          // Handle successful payment
          try {
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
              toast({
                title: "Payment Successful",
                description: "Your order has been paid for successfully.",
                variant: "default",
              });
              onSuccess();
            } else {
              toast({
                title: "Payment Verification Failed",
                description: result.data?.verifyPayment?.message || "Please contact support.",
                variant: "destructive",
              });
              onError("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            onError("Failed to verify payment");
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
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
              variant: "default",
            });
          }
        }
      };
      
      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error("Payment error:", error);
      onError("An error occurred during payment initialization");
    }
  };
  
  return (
    <Button 
      onClick={handlePayment} 
      disabled={initiatingPayment || verifyingPayment}
      className="w-full bg-blue-600 hover:bg-blue-700"
    >
      {initiatingPayment ? 'Processing...' : 'Pay Now with UPI'}
    </Button>
  );
};

export default RazorpayCheckout;
