// frontend/src/pages/Checkout.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentOptions from '@/components/payment/PaymentOptions';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState(null);
  
  // In a real app, you'd get these from your authentication context
  const userId = "1"; 
  
  useEffect(() => {
    // Normally you'd get this from your cart or from URL params
    // For testing, we'll just use mock data
    const mockOrder = {
      id: "order_" + Math.random().toString(36).substring(2, 10),
      totalAmount: 250.00,
      items: [
        { name: "Burger", price: 150, quantity: 1 },
        { name: "Fries", price: 100, quantity: 1 }
      ],
      canteenId: "1" // This should match one of your canteen IDs
    };
    
    setOrderDetails(mockOrder);
  }, []);
  
  const handlePaymentComplete = (method, status) => {
    toast({
      title: "Order Placed Successfully",
      description: `Your order has been placed with ${method} payment.`,
    });
    
    // Redirect to order tracking page
    navigate(`/order-tracking/${orderDetails.id}`);
  };
  
  if (!orderDetails) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentOptions 
                totalAmount={orderDetails.totalAmount}
                orderId={orderDetails.id}
                userId={userId}
                canteenId={orderDetails.canteenId}
                onPaymentComplete={handlePaymentComplete}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;