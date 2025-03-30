// src/lib/cookies.ts
import { cookies } from 'next/headers';

// Set a payment verification cookie that expires in 2 hours
export function setPaymentVerifiedCookie() {
  const twoHours = 2 * 60 * 60; // 2 hours in seconds
  cookies().set('payment-verified', 'true', { 
    maxAge: twoHours,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
}

// Clear the payment verification cookie
export function clearPaymentVerifiedCookie() {
  cookies().delete('payment-verified');
}