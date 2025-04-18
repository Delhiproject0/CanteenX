// src/pages/Checkout.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentOptions from '@/components/payment/PaymentOptions';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import MainLayout from '@/components/layout/MainLayout';

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { items, totalPrice, clearCart } = useCart();
  
  const userId = "1"; 
  
  useEffect(() => {
    // Add a small delay to ensure cart items are loaded from storage
    const timer = setTimeout(() => {
      setLoading(false);
      
      if (items.length === 0) {
        toast({
          title: "Empty Cart",
          description: "Your cart is empty. Please add items before checkout.",
          variant: "destructive",
        });
        navigate('/menu');
        return;
      }
      
      const generatedOrderId = "order_" + Math.random().toString(36).substring(2, 10);
      
      const orderData = {
        id: generatedOrderId,
        totalAmount: totalPrice,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price * item.quantity,
          quantity: item.quantity
        })),
        userId: userId,
        canteenId: items[0]?.canteenId || "1",
        status: "pending",
        orderTime: new Date().toISOString(),
      };
      
      setOrderDetails(orderData);
    }, 300); // Small delay to ensure cart is loaded
    
    return () => clearTimeout(timer);
  }, [items, totalPrice, navigate, toast]);
  
  const handlePaymentComplete = (method, status) => {
    const order = {
      ...orderDetails,
      paymentMethod: method,
      paymentStatus: status === "completed" ? "Paid" : "Pending",
      status: status === "completed" ? "confirmed" : "pending"
    };
    
    const existingOrders = JSON.parse(localStorage.getItem("smartCanteenOrders") || "[]");
    existingOrders.push(order);
    localStorage.setItem("smartCanteenOrders", JSON.stringify(existingOrders));
    
    clearCart();
    
    toast({
      title: "Order Placed Successfully",
      description: `Your order has been placed with ${method} payment.`,
    });
    
    navigate(`/order-tracking/${order.id}`);
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
              <p>Loading your cart...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!orderDetails) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p>Preparing your order...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
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
                  amount={orderDetails.totalAmount} 
                  onOrderComplete={handlePaymentComplete}
                  canteenId={items.length > 0 ? items[0].canteenId : 1}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;