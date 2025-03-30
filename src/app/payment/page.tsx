// src/app/payment/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PaymentForm from '@/components/PaymentForm';
import GhibliSuccessMessage from '@/components/GhiblishSuccessMessage';

interface PackageOption {
  id: string;
  name: string;
  photoCount: number;
  price: number;
  description: string;
}

export default function PaymentPage() {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [packageDetails, setPackageDetails] = useState<PackageOption | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the package details from sessionStorage
    const storedPackage = sessionStorage.getItem('selectedPhotoPackage');
    
    if (!storedPackage) {
      // If no package is selected, redirect to package selection
      router.push('/');
      return;
    }
    
    try {
      const packageInfo = JSON.parse(storedPackage);
      setPackageDetails(packageInfo);
    } catch (error) {
      console.error('Error parsing package information:', error);
      router.push('/');
    }
  }, [router]);

  const handlePaymentSuccess = (details: any) => {
    if (packageDetails) {
      // Add package information to the payment details
      const enhancedDetails = {
        ...details,
        packageInfo: packageDetails
      };
      
      // Store in session storage for the photo upload page
      sessionStorage.setItem('paymentDetails', JSON.stringify(enhancedDetails));
      
      // Update state to show success message
      setPaymentSuccess(true);
      setPaymentDetails(enhancedDetails);
    }
  };

  if (!packageDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-6 px-8 text-white">
          <h2 className="text-3xl font-bold">
            Complete Your Purchase
          </h2>
          <p className="mt-2 opacity-90">
            Pay securely to transform your photos into Ghibli style
          </p>
        </div>
        
        <div className="p-8">
          {paymentSuccess ? (
            <GhibliSuccessMessage paymentDetails={paymentDetails} />
          ) : (
            <div>
              <div className="mb-8">
                <div className="bg-purple-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                  <div className="mt-2 flex justify-between">
                    <span className="text-gray-600">{packageDetails.name} ({packageDetails.photoCount} {packageDetails.photoCount === 1 ? 'photo' : 'photos'})</span>
                    <span className="font-medium">₹{packageDetails.price}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">₹{packageDetails.price}</span>
                  </div>
                </div>
              
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Secure Transaction</h3>
                    <p className="text-sm text-gray-500">Your payment details are encrypted and secure</p>
                  </div>
                </div>
              </div>
              
              <PaymentForm 
                initialAmount={packageDetails.price.toString()}
                packageInfo={packageDetails}
                onSuccess={handlePaymentSuccess}
              />
              
              <div className="mt-8 flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-4">
                  <img src="https://cdn.razorpay.com/static/assets/logo/payment.svg" alt="Razorpay" className="h-8" />
                  <div className="text-sm text-gray-500">Powered by Razorpay</div>
                </div>
                <div className="flex space-x-4">
                  <div className="text-xs text-gray-400">Accepted payment methods:</div>
                  <div className="flex space-x-1">
                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {!paymentSuccess && (
        <div className="mt-6 flex justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Package Selection
          </Link>
        </div>
      )}
    </div>
  );
}