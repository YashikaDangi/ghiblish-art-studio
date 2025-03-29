// src/app/page.tsx
'use client';

import { useState } from 'react';
import DreamchantPaymentForm from '@/components/DreamchantPaymentForm';
import DreamchantSuccessMessage from '@/components/DreamchantSuccessMessage';

// This is the main page component that handles the payment flow
// It switches between the payment form and success message based on payment status

export default function Home() {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {paymentSuccess ? (
        <DreamchantSuccessMessage 
          paymentDetails={paymentDetails} 
          onReset={() => {
            setPaymentSuccess(false);
            setPaymentDetails(null);
          }} 
        />
      ) : (
        <DreamchantPaymentForm
          onSuccess={(details) => {
            setPaymentSuccess(true);
            setPaymentDetails(details);
          }}
        />
      )}
    </div>
  );
}