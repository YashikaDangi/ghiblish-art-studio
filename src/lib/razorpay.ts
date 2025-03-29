// In src/lib/razorpay.ts - Updated initialization

import Razorpay from 'razorpay';
import crypto from 'crypto';

// Get and validate Razorpay keys from environment variables
const getRazorpayKeys = () => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  
  if (!keyId || !keySecret) {
    console.error('Razorpay API keys are missing or invalid');
    throw new Error('Razorpay API keys are required. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables.');
  }
  
  // Log key information for debugging (without exposing the actual keys)
  console.log('Razorpay keys info:', {
    keyIdLength: keyId.length,
    keySecretLength: keySecret.length,
    keyIdPrefix: keyId.substring(0, 3) + '...',
    keySecretPrefix: keySecret.substring(0, 3) + '...'
  });
  
  return { keyId, keySecret };
};

// Initialize Razorpay with your key_id and key_secret
export const initializeRazorpay = () => {
  try {
    const { keyId, keySecret } = getRazorpayKeys();
    
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  } catch (error) {
    console.error('Failed to initialize Razorpay:', error);
    throw error;
  }
};

// Get a lazily initialized instance of Razorpay
let razorpayInstance: Razorpay | null = null;
export const getRazorpay = () => {
  if (!razorpayInstance) {
    razorpayInstance = initializeRazorpay();
  }
  return razorpayInstance;
};

// Create a new order
export const createOrder = async (amount: number, currency: string = 'INR') => {
  try {
    const razorpay = getRazorpay();
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    
    console.log('Creating order with options:', {
      ...options,
      amountInRupees: amount
    });
    
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
  try {
    const { keySecret } = getRazorpayKeys();
    
    // According to Razorpay official documentation
    // The string to sign is order_id + "|" + payment_id
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(orderId + "|" + paymentId)
      .digest('hex');
    
    // Log for debugging (remove in production)
    console.log('Signature verification:', {
      match: generatedSignature === signature,
      providedSignatureLength: signature.length,
      calculatedSignatureLength: generatedSignature.length
    });
    
    return generatedSignature === signature;
  } catch (error) {
    console.error('Error during signature verification:', error);
    return false;
  }
};