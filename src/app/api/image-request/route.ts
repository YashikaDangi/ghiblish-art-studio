import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ImageRequest from '@/models/ImageRequest';
import Payment from '@/models/Payment';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body
    const body = await req.json();
    const { paymentId, email, prompt, referenceImageUrls } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Find the payment to get image count
    const payment = await Payment.findOne({
      paymentId: paymentId,
      status: 'paid'
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found or not completed' },
        { status: 404 }
      );
    }

    // Create a new image generation request
    const imageRequest = await ImageRequest.create({
      paymentId,
      email,
      prompt,
      imageCount: payment.imageCount || 1,
      status: 'pending',
      referenceImages: referenceImageUrls || [],
    });

    return NextResponse.json({
      success: true,
      requestId: imageRequest._id,
      message: 'Image generation request submitted successfully',
    });
  } catch (error) {
    console.error('Error creating image request:', error);
    return NextResponse.json(
      { error: 'Failed to create image request' },
      { status: 500 }
    );
  }
}