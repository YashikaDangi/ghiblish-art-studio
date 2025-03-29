import React, { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';

interface PaymentDetails {
  orderId: string;
  paymentId: string;
  amount: number;
  email: string;
  imageCount: number;
}

interface DreamchantPageProps {
  onSuccess: (details: PaymentDetails) => void;
}

const DreamchantPage = ({ onSuccess }: DreamchantPageProps) => {
  const [selectedOption, setSelectedOption] = useState(3);
  const [email, setEmail] = useState('');
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    orderId: string;
    paymentId: string;
    amount: number;
    email: string;
    imageCount: number;
  } | null>(null);
  
  const options = [
    { id: 1, count: 1, price: 5, perImage: 5 },
    { id: 2, count: 3, price: 12, perImage: 4, isPopular: true },
    { id: 3, count: 5, price: 15, perImage: 3 }
  ];

  const handleOptionSelect = (option:any) => {
    setSelectedOption(option.count);
  };

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

  const getSelectedOptionDetails = () => {
    return options.find(opt => opt.count === selectedOption) || options[1];
  };

  const handleContinue = async (e:any) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!isRazorpayLoaded) {
      setError('Payment system is not loaded yet. Please try again.');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');

      const selectedOption = getSelectedOptionDetails();
      const amount = selectedOption.price;

      // Create order on the server
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Initialize Razorpay payment
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_key';
      
      if (!razorpayKeyId) {
        throw new Error('Razorpay key is missing');
      }
      
      const options = {
        key: razorpayKeyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Dreamchant',
        description: `Payment for ${selectedOption.count} dreamchanted images`,
        order_id: data.id,
        handler: async function (response:any) {
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
              amount: selectedOption.price,
              email,
              imageCount: selectedOption.count
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
            setError(errorMessage);
            setIsProcessing(false);
          }
        },
        prefill: {
          email: email,
        },
        theme: {
          color: '#4338CA',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const handleUploadImages = () => {
    // This would be implemented to handle the actual image upload
    // For now, we'll just show a mock success message
    alert(`Ready to upload ${getSelectedOptionDetails().count} images!`);
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={handleRazorpayLoad}
      />
      
      <div className="max-w-lg mx-auto mt-10 text-center">
        <div className="mb-8">
          <div className="inline-block">
            <img src="/api/placeholder/60/60" alt="Wizard icon" className="mb-2 mx-auto" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Turn Your Photos Into
            <div className="text-indigo-600">Magical Art</div>
          </h1>
          <p className="text-gray-600 mb-4">Creating magic for over 413 creators</p>
          <div className="flex justify-center space-x-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                <img src="/api/placeholder/32/32" alt="User avatar" />
              </div>
            ))}
            <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs">+10</div>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Dreamchant Your Images</h2>
          <p className="text-gray-600 mb-4">Select number of images you want</p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            {options.map(option => (
              <div
                key={option.id}
                className={`relative rounded-lg p-4 ${
                  selectedOption === option.count
                    ? 'border-2 border-indigo-500 bg-indigo-50'
                    : 'border border-gray-200'
                } cursor-pointer transition`}
                onClick={() => handleOptionSelect(option)}
              >
                {option.isPopular && (
                  <div className="absolute -top-3 left-0 right-0">
                    <span className="bg-indigo-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`text-4xl font-bold ${selectedOption === option.count ? 'text-indigo-500' : 'text-gray-700'} mb-2`}>
                  {option.count}
                </div>
                <div className="font-bold text-lg mb-1">${option.price}</div>
                <div className="text-xs text-gray-500">${option.perImage} per image</div>
              </div>
            ))}
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700 mb-1">
              Your Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            To prevent spam, you'll be prompted to upload the photos after checkout.
          </p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
        </div>
        
        <button
          onClick={handleContinue}
          disabled={isProcessing}
          className="inline-flex items-center justify-center py-3 px-6 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium transition mb-8"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
              </svg>
              Continue
            </>
          )}
        </button>
        
        <div className="mb-8">
          <div className="text-5xl font-bold text-indigo-600 mb-1">3,353</div>
          <div className="text-gray-600">Images Dreamchanted</div>
        </div>
        
        <div className="mb-4">
          <div className="text-2xl font-bold mb-2">Examples</div>
          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </>
  );
};

export default DreamchantPage;