// src/components/DreamchantSuccessMessage.tsx
import React from "react";
import Link from "next/link";

interface SuccessMessageProps {
  paymentDetails: {
    orderId: string;
    paymentId: string;
    amount: number;
    email: string;
    imageCount: number;
  };
  onReset: () => void;
}

export default function DreamchantSuccessMessage({
  paymentDetails,
  onReset,
}: SuccessMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 font-sans">
      {/* Header with wizard */}
      <div className="w-20 h-20 mb-4">
        <img
          src="/api/placeholder/80/80"
          alt="Wizard character"
          className="w-full h-full"
        />
      </div>

      <div className="text-center">
        <div className="success-animation mb-6">
          <div className="checkmark-circle">
            <div className="background"></div>
            <div className="checkmark draw"></div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We'll start transforming your photos into
          magical art.
        </p>
      </div>

      <div className="w-full bg-white border border-gray-300 rounded-xl overflow-hidden shadow mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
          <h4 className="text-white font-medium">Order Details</h4>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Package
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {paymentDetails.imageCount} Images
              </p>
            </div>

            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Amount Paid
              </p>
              <p className="text-2xl font-bold text-gray-800">
                ${paymentDetails.amount.toFixed(2)}
              </p>
            </div>

            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Order ID
              </p>
              <p className="text-sm font-medium text-gray-800 truncate">
                {paymentDetails.orderId}
              </p>
            </div>

            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800">
                {paymentDetails.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mb-8">
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-3 rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150"
        >
          Upload Your Photos
        </button>
      </div>

      {/* Stats */}
      <div className="text-center mb-8">
        <div className="text-5xl font-bold text-indigo-500 mb-2">3,353</div>
        <div className="text-gray-600">Images Dreamchanted</div>
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
          background: #6366f1;
          position: absolute;
        }

        .checkmark {
          border-radius: 5px;
        }

        .checkmark.draw:after {
          content: "";
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
