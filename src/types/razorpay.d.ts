declare module 'razorpay' {
    export interface RazorpayOptions {
      key_id: string;
      key_secret: string;
    }
  
    export interface OrderOptions {
      amount: number;
      currency?: string;
      receipt?: string;
      notes?: Record<string, any>;
      payment_capture?: boolean;
    }
  
    export interface RazorpayOrder {
      id: string;
      entity: string;
      amount: number;
      amount_paid: number;
      amount_due: number;
      currency: string;
      receipt: string;
      status: string;
      attempts: number;
      notes: Record<string, any>;
      created_at: number;
    }
  
    export interface RazorpayPayment {
      id: string;
      entity: string;
      amount: number;
      currency: string;
      status: string;
      order_id: string;
      invoice_id: string;
      international: boolean;
      method: string;
      amount_refunded: number;
      refund_status: string;
      captured: boolean;
      description: string;
      card_id: string;
      bank: string;
      wallet: string;
      vpa: string;
      email: string;
      contact: string;
      notes: Record<string, any>;
      fee: number;
      tax: number;
      error_code: string;
      error_description: string;
      created_at: number;
    }
  
    export interface Orders {
      create(options: OrderOptions): Promise<RazorpayOrder>;
      fetch(orderId: string): Promise<RazorpayOrder>;
      fetchPayments(orderId: string): Promise<RazorpayPayment[]>;
    }
  
    export interface Payments {
      fetch(paymentId: string): Promise<RazorpayPayment>;
      capture(paymentId: string, amount: number, currency?: string): Promise<RazorpayPayment>;
    }
  
    export default class Razorpay {
      constructor(options: RazorpayOptions);
      orders: Orders;
      payments: Payments;
    }
  }