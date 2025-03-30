// src/app/api/create-order/route.ts
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
    const { amount, email, packageId, photoCount } = body;

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

    // Validate package selection if provided
    if (packageId) {
      // Optional validation: ensure amount matches expected package price
      const isValidPackage = validatePackageAmount(packageId, amount);
      if (!isValidPackage) {
        return NextResponse.json(
          { error: 'Invalid package selection or amount' },
          { status: 400 }
        );
      }
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
      packageId: packageId || null,
      photoCount: photoCount || null,
      type: packageId ? 'ghibli_transformation' : 'standard',
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

// Helper function to validate that a package amount is correct
function validatePackageAmount(packageId: string, amount: number): boolean {
  // Define package pricing
  const packagePricing: Record<string, number> = {
    'basic': 50,
    'standard': 200,
    'premium': 500
  };
  
  // Check if package exists and amount matches
  return packageId in packagePricing && packagePricing[packageId] === amount;
}