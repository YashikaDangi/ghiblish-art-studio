'use client';

import { useState } from 'react';
import Link from 'next/link';
import PaymentForm from '@/components/PaymentForm';
import SuccessMessage from '@/components/SuccessMessage';
import PhotoUpload from '@/components/PhotoUpload';

const PRICE_PER_IMAGE = 20; // ₹20 per image

export default function Home() {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  
  // New states for DreamChant flow
  const [showPayment, setShowPayment] = useState(false);
  const [imageCount, setImageCount] = useState(1);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleProceedToPayment = () => {
    // Validate email
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate image count
    if (imageCount < 1) {
      setError('Please select at least 1 image');
      return;
    }

    setError('');
    setShowPayment(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8 text-white">
          <h2 className="text-3xl font-bold">
            DreamChant AI Images
          </h2>
          <p className="mt-2 opacity-90">
            Create stunning AI-generated images with our advanced technology
          </p>
        </div>
        
        <div className="p-8">
          {showPhotoUpload ? (
            <PhotoUpload 
              paymentDetails={paymentDetails}
              onComplete={() => {
                setShowPhotoUpload(false);
                setPaymentSuccess(false);
                setPaymentDetails(null);
                setShowPayment(false);
              }}
            />
          ) : paymentSuccess ? (
            <SuccessMessage 
              paymentDetails={paymentDetails} 
              onReset={() => {
                // After showing the success message, move to photo upload
                setShowPhotoUpload(true);
              }} 
            />
          ) : showPayment ? (
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payment for {imageCount} {imageCount === 1 ? 'image' : 'images'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Total: ₹{(imageCount * PRICE_PER_IMAGE).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <PaymentForm 
                onSuccess={(details) => {
                  setPaymentSuccess(true);
                  setPaymentDetails({
                    ...details,
                    imageCount: imageCount
                  });
                }} 
                prefillEmail={email}
                prefillAmount={(imageCount * PRICE_PER_IMAGE).toString()}
                imageCount={imageCount}
              />
              
              <button
                onClick={() => setShowPayment(false)}
                className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Options
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">How many images would you like?</h3>
                    <p className="text-sm text-gray-500">Each image costs ₹{PRICE_PER_IMAGE.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <button 
                      onClick={() => setImageCount(Math.max(1, imageCount - 1))}
                      className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors"
                    >
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <div className="text-2xl font-bold text-gray-800">{imageCount}</div>
                    
                    <button 
                      onClick={() => setImageCount(imageCount + 1)}
                      className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors"
                    >
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-right mt-2 text-sm text-indigo-600 font-medium">
                    Total: ₹{(imageCount * PRICE_PER_IMAGE).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Your Email Address</h3>
                    <p className="text-sm text-gray-500">We'll send your generated images here</p>
                  </div>
                </div>

                <div className="mt-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
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

              <button
                onClick={handleProceedToPayment}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150"
              >
                Proceed to Payment
                <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-center space-x-6">
        <Link 
          href="/payment-history" 
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          View Payment History
        </Link>
        
        <Link 
          href="/request-status" 
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Check Request Status
        </Link>
      </div>
    </div>
  );
}