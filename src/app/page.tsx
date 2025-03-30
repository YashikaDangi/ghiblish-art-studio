'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PaymentForm from '@/components/PaymentForm';
import SuccessMessage from '@/components/SuccessMessage';

export default function Home() {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen bg-slate-50 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Decorative elements - cartoonish clouds */}
      <div className="fixed top-20 left-10 w-24 h-16 bg-white rounded-full"></div>
      <div className="fixed top-16 left-20 w-32 h-20 bg-white rounded-full"></div>
      <div className="fixed top-36 right-20 w-32 h-16 bg-white rounded-full"></div>
      <div className="fixed top-32 right-36 w-24 h-16 bg-white rounded-full"></div>
      <div className="fixed bottom-32 left-1/4 w-32 h-16 bg-white rounded-full"></div>
      <div className="fixed bottom-36 left-1/4 -ml-12 w-24 h-14 bg-white rounded-full"></div>
      
      <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        {/* Playful header */}
        <div className="text-center mb-16">
          <div className="inline-block relative mb-6">
            <h1 className="text-5xl font-bold text-indigo-600 mb-2 tracking-tight relative z-10">
              Photo Upload Service
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-4 bg-yellow-300 -z-10 transform -rotate-1"></div>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Preserve your memories with our premium photo storage solution
          </p>
        </div>

        {/* Main content - No box, open layout */}
        <div className="space-y-16">
          {/* Header section */}
          {/* <div className={`text-center ${isLoaded ? 'animate-bounce-in' : ''}`}>
            <div className="inline-block bg-indigo-100 py-3 px-6 rounded-full mb-6">
              <h2 className="text-2xl font-bold text-indigo-600">
                {paymentSuccess ? 'Payment Successful!' : 'Choose Your Package'}
              </h2>
            </div>
            {!paymentSuccess && (
              <p className="text-slate-600 max-w-xl mx-auto">
                Select the perfect package for your photo collection and complete your payment in just a few clicks
              </p>
            )}
          </div> */}

          {paymentSuccess ? (
            <div className="max-w-2xl mx-auto">
              <SuccessMessage 
                paymentDetails={paymentDetails} 
                onReset={() => {
                  setPaymentSuccess(false);
                  setPaymentDetails(null);
                }} 
              />
            </div>
          ) : (
            <>
              {/* Package selection - Cartoon-style cards */}
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                  { name: 'Basic', photos: '100', price: '499', color: 'bg-green-400', features: ['Cloud storage', 'Easy sharing', 'Basic editing'] },
                  { name: 'Standard', photos: '500', price: '999', color: 'bg-indigo-400', features: ['Cloud storage', 'Easy sharing', 'Advanced editing', 'Albums'] },
                  { name: 'Premium', photos: '2000', price: '1999', color: 'bg-purple-400', features: ['Cloud storage', 'Easy sharing', 'Pro editing', 'Albums', 'AI organization'] },
                ].map((pkg, index) => (
                  <div 
                    key={index}
                    className={`rounded-xl p-6 ${pkg.color} text-white transform transition-all duration-300 hover:scale-105 ${isLoaded ? 'animate-pop-in' : ''}`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                      <h4 className="text-xl font-bold mb-3">{pkg.name}</h4>
                      <div className="text-3xl font-bold mb-3">₹{pkg.price}</div>
                      <p className="opacity-90 mb-4">Upload up to {pkg.photos} photos</p>
                      <ul className="space-y-2 text-sm mb-4">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment form */}
              <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-full bg-indigo-100">
                    <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-slate-800">Complete Your Purchase</h3>
                    <p className="text-slate-600">Enter your details below to process the payment</p>
                  </div>
                </div>
                <PaymentForm 
                  onSuccess={(details) => {
                    setPaymentSuccess(true);
                    setPaymentDetails(details);
                  }} 
                />
              </div>
            </>
          )}

          {/* Features section with cartoon-style icons */}
          <div className="py-12">
            <h3 className="text-2xl font-bold text-center text-indigo-600 mb-10 relative inline-block mx-auto">
              <span className="relative z-10">Why Choose Us?</span>
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-yellow-300 -z-10 transform -rotate-1"></div>
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className={`text-center ${isLoaded ? 'animate-slide-in-left' : ''}`}>
                <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Secure Storage</h4>
                <p className="text-slate-600">Your photos are securely stored with multiple backups</p>
              </div>
              
              <div className={`text-center ${isLoaded ? 'animate-slide-in-left' : ''}`} style={{ animationDelay: "150ms" }}>
                <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Beautiful Galleries</h4>
                <p className="text-slate-600">Showcase your photos in stunning gallery layouts</p>
              </div>
              
              <div className={`text-center ${isLoaded ? 'animate-slide-in-left' : ''}`} style={{ animationDelay: "300ms" }}>
                <div className="w-24 h-24 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Easy Sharing</h4>
                <p className="text-slate-600">Share with friends and family with just a click</p>
              </div>
            </div>
          </div>
          
          {/* Testimonials with cartoon speech bubbles */}
          <div className="pt-8 pb-16">
            <h3 className="text-2xl font-bold text-center text-indigo-600 mb-10 relative inline-block mx-auto">
              <span className="relative z-10">What Our Users Say</span>
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-yellow-300 -z-10 transform -rotate-1"></div>
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { name: "Sarah J.", quote: "The easiest way to store my travel photos.", color: "bg-green-100" },
                { name: "Michael T.", quote: "Beautiful interface and very reliable service.", color: "bg-indigo-100" },
                { name: "Priya K.", quote: "I love how easy it is to share photos with family.", color: "bg-purple-100" }
              ].map((testimonial, index) => (
                <div key={index} className={`${isLoaded ? 'animate-float-in' : ''}`} style={{ animationDelay: `${index * 200}ms` }}>
                  <div className={`${testimonial.color} p-5 rounded-2xl relative mb-6`}>
                    <p className="text-slate-700 italic">"{testimonial.quote}"</p>
                    {/* Speech bubble triangle */}
                    <div className={`absolute -bottom-4 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent ${testimonial.color.replace('bg-', 'border-t-')}`}></div>
                  </div>
                  <div className="flex items-center pl-8">
                    <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <p className="ml-3 font-medium text-slate-700">{testimonial.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex justify-center space-x-6 items-center">
            <Link 
              href="/payment-history" 
              className="inline-flex items-center bg-indigo-100 text-indigo-600 hover:bg-indigo-200 py-3 px-6 rounded-full transition-colors font-medium"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Payment History
            </Link>
            
            <Link 
              href="/photo-gallery" 
              className="inline-flex items-center bg-green-100 text-green-600 hover:bg-green-200 py-3 px-6 rounded-full transition-colors font-medium"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View Gallery
            </Link>
          </div>
        </div>
      </div>
      
      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          70% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes floatIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        .animate-pop-in {
          animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out forwards;
        }
        
        .animate-float-in {
          animation: floatIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}