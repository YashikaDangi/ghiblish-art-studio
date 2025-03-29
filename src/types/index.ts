export interface PaymentOrder {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
  }
  
  export interface PaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }
  
  export interface PaymentRecord {
    _id: string;
    orderId: string;
    paymentId?: string;
    signature?: string;
    amount: number;
    currency: string;
    status: 'created' | 'attempted' | 'paid' | 'failed';
    email: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PaymentDetails {
    orderId: string;
    paymentId: string;
    amount: number;
    email: string;
  }