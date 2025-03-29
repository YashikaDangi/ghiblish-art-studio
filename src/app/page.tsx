'use client';

import { useState } from 'react';
import PaymentForm from '@/components/PaymentForm';
import SuccessMessage from '@/components/SuccessMessage';

export default function Home() {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8 text-white">
          <h2 className="text-3xl font-bold">
            Fast & Secure Payments
          </h2>
          <p className="mt-2 opacity-90">
            Complete your payment in just a few steps with Razorpay
          </p>
        </div>
        
        <div className="p-8">
          {paymentSuccess ? (
            <SuccessMessage 
              paymentDetails={paymentDetails} 
              onReset={() => {
                setPaymentSuccess(false);
                setPaymentDetails(null);
              }} 
            />
          ) : (
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Secure Transaction</h3>
                  <p className="text-sm text-gray-500">Your payment details are encrypted and secure</p>
                </div>
              </div>
              
              <PaymentForm 
                onSuccess={(details) => {
                  setPaymentSuccess(true);
                  setPaymentDetails(details);
                }} 
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
      
    
    </div>
  );
}