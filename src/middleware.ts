// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // If the path is /photo-upload, check if the user has completed payment
  if (path === '/photo-upload') {
    // Check for the payment cookie that we'll set after successful payment
    const paymentVerified = request.cookies.get('payment-verified');
    
    // If no payment cookie found, redirect to homepage
    if (!paymentVerified) {
      const url = new URL('/', request.url);
      url.searchParams.set('error', 'payment-required');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure the paths that this middleware should run on
export const config = {
  matcher: ['/photo-upload'],
};