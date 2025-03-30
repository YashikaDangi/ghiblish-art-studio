// src/app/api/check-payment-session/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Check if the payment-verified cookie exists
    const paymentVerified = req.cookies.get('payment-verified');
    
    if (!paymentVerified) {
      // No valid payment session
      return NextResponse.json(
        { error: 'No active payment session' },
        { status: 401 }
      );
    }

    // Valid payment session exists
    return NextResponse.json({ 
      success: true,
      message: 'Active payment session found'
    });
  } catch (error) {
    console.error('Error checking payment session:', error);
    return NextResponse.json(
      { error: 'Failed to check payment session' },
      { status: 500 }
    );
  }
}