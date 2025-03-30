import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get email and orderId from query parameters
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const orderId = url.searchParams.get('orderId');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Find the payment record
    const payment = await Payment.findOne({ orderId, email });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Check if payment is paid
    if (payment.status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment is not completed', status: payment.status },
        { status: 400 }
      );
    }

    // Get photos from the uploads array
    const photos = payment.uploads || [];

    return NextResponse.json({
      photos,
      packageDetails: payment.packageDetails,
      uploadedCount: payment.photosUploaded || 0,
      email: payment.email
    });
  } catch (error) {
    console.error('Error fetching photo gallery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo gallery' },
      { status: 500 }
    );
  }
}