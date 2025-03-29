// src/components/DreamchantPaymentForm.tsx
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';

interface PaymentFormProps {
  onSuccess: (details: any) => void;
}

interface PackageOption {
  id: number;
  count: number;
  price: number;
  perImage: number;
  popular?: boolean;
}

declare global {
  interface Window {
    Razorpay: {
      new(options: RazorpayOptions): RazorpayInstance;
    };
  }
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
    method?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
    backdrop_color?: string;
    hide_topbar?: boolean;
  };
  modal?: {
    backdropclose?: boolean;
    escape?: boolean;
    handleback?: boolean;
    confirm_close?: boolean;
    ondismiss?: () => void;
    animation?: boolean;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  close(): void;
}

export default function DreamchantPaymentForm({ onSuccess }: PaymentFormProps) {
  // Package options
  const packageOptions: PackageOption[] = [
    { id: 1, count: 1, price: 5, perImage: 5 },
    { id: 2, count: 3, price: 12, perImage: 4, popular: true },
    { id: 3, count: 5, price: 15, perImage: 3 },
  ];

  const [selectedOption, setSelectedOption] = useState<number>(2); // Default to the middle option
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setIsRazorpayLoaded(true);
    }
  }, []);

  const handleRazorpayLoad = () => {
    setIsRazorpayLoaded(true);
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!isRazorpayLoaded) {
      setError('Payment system is not loaded yet. Please try again.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const selectedPackage = packageOptions.find(pkg => pkg.id === selectedOption);
      if (!selectedPackage) {
        throw new Error('Please select a package');
      }

      // Create order on the server
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPackage.price,
          email,
          packageDetails: {
            imageCount: selectedPackage.count,
            pricePerImage: selectedPackage.perImage
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Initialize Razorpay payment
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      
      if (!razorpayKeyId) {
        setError('Payment key is missing. Please check your environment variables.');
        setLoading(false);
        return;
      }
      
      const options: RazorpayOptions = {
        key: razorpayKeyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Dreamchant Image Magic',
        description: `Transform ${selectedPackage.count} images into magical art`,
        order_id: data.id,
        handler: async function (response: RazorpayResponse) {
          try {
            // Verify payment on the server
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            // Call onSuccess callback with payment details
            onSuccess({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: selectedPackage.price,
              email,
              imageCount: selectedPackage.count
            });
          } catch (error: any) {
            setError(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          email: email,
        },
        theme: {
          color: '#4F46E5',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          },
        },
      };

      try {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error: any) {
        setError(error.message || 'Failed to initialize payment');
        setLoading(false);
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 font-sans">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={handleRazorpayLoad}
      />

      {/* Wizard character and header */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="w-20 h-20 mb-2">
          <img src="/api/placeholder/80/80" alt="Wizard character" className="w-full h-full" />
        </div>
        <h1 className="text-4xl font-bold text-center mb-2">
          Turn Your Photos Into
          <br />
          <span className="text-indigo-500">Magical Art</span>
        </h1>
        <p className="text-gray-700 text-center mb-4">Creating magic for over 413 creators</p>
        
        {/* Avatar row */}
        <div className="flex -space-x-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`w-8 h-8 rounded-full ${i === 5 ? 'bg-gray-900 text-white flex items-center justify-center text-xs' : 'bg-gray-300'} border-2 border-white`}>
              {i === 5 && '+10'}
            </div>
          ))}
        </div>
      </div>

      {/* Display errors if any */}
      {error && (
        <div className="w-full bg-red-50 p-4 rounded-lg border-l-4 border-red-500 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Main card */}
        <div className="w-full border border-gray-300 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Dreamchant Your Images</h2>
          <p className="text-gray-700 mb-4">Select number of images you want</p>
          
          {/* Option cards */}
          <div className="flex justify-between gap-4 mb-6">
            {packageOptions.map((option) => (
              <div
                key={option.id}
                className={`flex-1 border rounded-lg p-4 flex flex-col items-center cursor-pointer relative transition-all ${
                  selectedOption === option.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-400'
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-28">
                    <div className="bg-indigo-500 text-white text-xs py-1 px-2 rounded-full text-center">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 ${
                  selectedOption === option.id ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-500'
                }`}>
                  {option.count}
                </div>
                <div className="text-xl font-bold">${option.price}</div>
                <div className="text-sm text-gray-500">${option.perImage} per image</div>
              </div>
            ))}
          </div>
          
          {/* Email input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Your Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {/* Info text */}
          <p className="text-gray-700 text-sm">
            To prevent spam, you'll be prompted to upload the photos after checkout.
          </p>
        </div>
        
        {/* Continue button */}
        <button 
          type="submit"
          disabled={loading}
          className="bg-indigo-200 hover:bg-indigo-300 text-indigo-800 py-2 px-6 rounded-lg flex items-center justify-center w-48 mx-auto mb-12 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Continue
            </>
          )}
        </button>
      </form>
      
      {/* Stats */}
      <div className="text-center mb-8">
        <div className="text-5xl font-bold text-indigo-500 mb-2">3,353</div>
        <div className="text-gray-600">Images Dreamchanted</div>
      </div>
      
      {/* Examples section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>
        <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>


    </div>
  );
}