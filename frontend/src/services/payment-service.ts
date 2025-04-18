import axios from 'axios';

export class PaymentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  async createPaymentOrder(orderData: any) {
    try {
      // For test mode, create a mock order
      if (import.meta.env.DEV) {
        console.log("Creating mock payment order in dev mode");
        return {
          id: `order_${Date.now()}`,
          amount: orderData.amount,
          currency: orderData.currency,
          receipt: orderData.receipt
        };
      }
      
      const response = await axios.post(`${this.baseUrl}/api/payments/create-order`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment order:', error);
      
      // In development, return a mock order on error
      if (import.meta.env.DEV) {
        console.log("Returning mock payment order after error");
        return {
          id: `order_${Date.now()}`,
          amount: orderData.amount,
          currency: orderData.currency,
          receipt: orderData.receipt
        };
      }
      
      throw new Error(error.response?.data?.detail || 'Failed to create payment order');
    }
  }

  async verifyPayment(verificationData: any) {
    try {
      // For test mode, mock a successful verification
      if (import.meta.env.DEV) {
        console.log("Mock verifying payment in dev mode:", verificationData);
        return { status: "success" };
      }
      
      const response = await axios.post(`${this.baseUrl}/api/payments/verify-payment`, verificationData);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw new Error(error.response?.data?.detail || 'Failed to verify payment');
    }
  }

  async getMerchantDetails(canteenId: number) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/payments/merchant-details/${canteenId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching merchant details:', error);
      throw new Error('Failed to fetch merchant details');
    }
  }
}

export const paymentService = new PaymentService();