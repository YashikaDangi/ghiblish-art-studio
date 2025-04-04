import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import connectToDatabase from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    console.log('Payment verification details:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      // Don't log the full signature for security reasons
      signatureLength: razorpay_signature.length,
    });

    // First, update payment to attempted status
    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { 
        status: 'attempted',
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      }
    );

    // Verify the payment signature
    const isValidSignature = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidSignature) {
      // Update payment status to failed if signature verification fails
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { 
          status: 'failed',
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
        }
      );

      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update payment status in the database to paid
    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { 
        status: 'paid',
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      },
      { new: true }
    );

    if (!payment) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Create a response with the payment verification cookie
    const response = NextResponse.json({
      success: true,
      payment: {
        id: payment._id,
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        amount: payment.amount,
        status: payment.status,
      },
    });

    // Set a payment verification cookie that lasts for 2 hours
    response.cookies.set('payment-verified', 'true', {
      maxAge: 7200, // 2 hours in seconds
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}