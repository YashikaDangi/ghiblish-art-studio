// src/app/dreamchant/page.tsx
'use client';

import { useState } from 'react';
import DreamchantPage from '@/components/DreamchantPage';
import ImageUpload from '@/components/ImageUpload';

// Define the payment details interface
interface PaymentDetails {
  orderId: string;
  paymentId: string;
  amount: number;
  email: string;
  imageCount: number;
}

export default function DreamchantPageWrapper() {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  const handlePaymentSuccess = (details: PaymentDetails) => {
    setPaymentDetails(details);
    setPaymentSuccess(true);
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6">
      {paymentSuccess && paymentDetails ? (
        <ImageUpload paymentDetails={paymentDetails} />
      ) : (
        <DreamchantPage onSuccess={handlePaymentSuccess} />
      )}
    </main>
  );
}