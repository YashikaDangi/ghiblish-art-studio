import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ImageRequest from '@/models/ImageRequest';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const requestId = url.searchParams.get('requestId');

    if (!email && !requestId) {
      return NextResponse.json(
        { error: 'Either email or requestId is required' },
        { status: 400 }
      );
    }

    let query = {};
    if (requestId) {
      query = { _id: requestId };
    } else if (email) {
      query = { email };
    }

    // Find requests
    const requests = await ImageRequest.find(query)
      .sort({ createdAt: -1 })
      .select('_id prompt imageCount status createdAt updatedAt');

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error checking request status:', error);
    return NextResponse.json(
      { error: 'Failed to check request status' },
      { status: 500 }
    );
  }
}