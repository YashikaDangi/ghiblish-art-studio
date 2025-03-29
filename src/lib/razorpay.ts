import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  throw new Error('Razorpay API keys are required. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables.');
}

// Initialize Razorpay with your key_id and key_secret
export const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

// Create a new order
export const createOrder = async (amount: number, currency: string = 'INR') => {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Verify Razorpay payment signature
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!razorpayKeySecret) {
    throw new Error('Razorpay key secret is required to verify signatures');
  }
  
  const text = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', razorpayKeySecret)
    .update(text)
    .digest('hex');

  return expectedSignature === signature;
};