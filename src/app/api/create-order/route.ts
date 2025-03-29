import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/razorpay';
import connectToDatabase from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body
    const body = await req.json();
    const { amount, email, imageCount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount is required and must be greater than 0' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create a Razorpay order
    const order = await createOrder(amount);

    // Store order information in the database
    await Payment.create({
      orderId: order.id,
      amount: amount,
      currency: 'INR',
      status: 'created',
      email,
      imageCount, // Store the number of images if provided
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}