import React from 'react';
import Link from 'next/link';

interface SuccessMessageProps {
  paymentDetails: {
    orderId: string;
    paymentId: string;
    amount: number;
    email: string;
    package?: {
      name: string;
      photoLimit: number;
      description: string;
    };
  };
  onReset: () => void;
}

export default function SuccessMessage({ paymentDetails, onReset }: SuccessMessageProps) {
  return (
    <div className="text-center">
      <div className="success-animation mb-6">
        <div className="checkmark-circle">
          <div className="background"></div>
          <div className="checkmark draw"></div>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
      <p className="text-gray-600 mb-8">
        Thank you for your payment. Your transaction has been completed successfully.
      </p>
      
      <div className="bg-gray-50 rounded-xl overflow-hidden shadow mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
          <h4 className="text-white font-medium">Payment Details</h4>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-gray-800">₹{paymentDetails.amount.toFixed(2)}</p>
            </div>
            
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Payment ID</p>
              <p className="text-sm font-medium text-gray-800 truncate">{paymentDetails.paymentId}</p>
            </div>
            
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Order ID</p>
              <p className="text-sm font-medium text-gray-800 truncate">{paymentDetails.orderId}</p>
            </div>
            
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Email</p>
              <p className="text-sm font-medium text-gray-800">{paymentDetails.email}</p>
            </div>

            {paymentDetails.package && (
              <div className="text-left col-span-2">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Package</p>
                <p className="text-sm font-medium text-gray-800">
                  {paymentDetails.package.name} - {paymentDetails.package.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href={`/upload-photos?orderId=${paymentDetails.orderId}`}
          className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150"
        >
          Upload Photos
        </Link>
        
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150"
        >
          Make Another Payment
        </button>
      </div>
      
      <style jsx>{`
        .success-animation {
          margin: 0 auto;
          width: 80px;
          height: 80px;
          position: relative;
        }
        
        .checkmark-circle {
          width: 80px;
          height: 80px;
          position: relative;
          display: inline-block;
          vertical-align: top;
        }
        
        .background {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #10b981;
          position: absolute;
        }
        
        .checkmark {
          border-radius: 5px;
        }
        
        .checkmark.draw:after {
          content: '';
          width: 35px;
          height: 18px;
          position: absolute;
          left: 22px;
          top: 30px;
          border-right: 6px solid #fff;
          border-top: 6px solid #fff;
          transform: scaleX(-1) rotate(135deg);
          transform-origin: left top;
          animation: checkmark-appear 0.8s ease;
        }
        
        @keyframes checkmark-appear {
          0% {
            height: 0;
            width: 0;
            opacity: 1;
          }
          20% {
            height: 0;
            width: 35px;
            opacity: 1;
          }
          40% {
            height: 18px;
            width: 35px;
            opacity: 1;
          }
          100% {
            height: 18px;
            width: 35px;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}