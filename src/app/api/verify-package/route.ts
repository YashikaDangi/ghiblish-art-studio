import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get orderId from query parameters
    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Find the payment record
    const payment = await Payment.findOne({ orderId });

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

    // Return package details and upload count
    return NextResponse.json({
      email: payment.email,
      photoLimit: payment.packageDetails.photoLimit,
      packageName: payment.packageDetails.name,
      uploadedCount: payment.photosUploaded || 0,
      remainingUploads: payment.packageDetails.photoLimit - (payment.photosUploaded || 0)
    });
  } catch (error) {
    console.error('Error verifying package:', error);
    return NextResponse.json(
      { error: 'Failed to verify package' },
      { status: 500 }
    );
  }
}