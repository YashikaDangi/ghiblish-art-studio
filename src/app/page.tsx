// src/app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PackageOption {
  id: string;
  name: string;
  photoCount: number;
  price: number;
  description: string;
}

export default function Home() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);

  const packages: PackageOption[] = [
    {
      id: 'basic',
      name: 'Single Photo',
      photoCount: 1,
      price: 50,
      description: 'Transform 1 photo into Ghibli style'
    },
    {
      id: 'standard',
      name: 'Photo Pack',
      photoCount: 5,
      price: 200,
      description: 'Transform 5 photos into Ghibli style'
    },
    {
      id: 'premium',
      name: 'Studio Collection',
      photoCount: 15,
      price: 500,
      description: 'Transform 15 photos into Ghibli style'
    }
  ];

  const handleContinue = () => {
    if (selectedPackage) {
      // Store the selected package in session storage
      sessionStorage.setItem('selectedPhotoPackage', JSON.stringify(selectedPackage));
      
      // Redirect to payment page
      router.push('/payment');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Ghibli Style</span>
            <span className="block">Photo Transformer</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500">
            Transform your favorite photos into beautiful Studio Ghibli art style with AI-powered technology.
          </p>
        </div>

        {/* Example Images */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg">
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="text-white text-sm font-medium">Original Photo</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800">
                  Your Photo
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <svg className="h-12 w-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg">
                <div className="absolute inset-0 bg-purple-200 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="text-white text-sm font-medium">Ghibli Style</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-0.5 text-sm font-medium text-purple-800">
                  AI Transformed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-center w-12 h-12 bg-pink-100 text-pink-600 rounded-full mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">1. Choose a Package</h3>
              <p className="text-gray-500">
                Select how many photos you want to transform into Ghibli style art.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">2. Complete Payment</h3>
              <p className="text-gray-500">
                Pay securely using Razorpay. We offer affordable packages for everyone.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">3. Upload & Transform</h3>
              <p className="text-gray-500">
                Upload your photos and watch them transform into beautiful Ghibli-style artwork to download.
              </p>
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Choose Your Package</h2>
          
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-6 px-8 text-white">
              <h2 className="text-3xl font-bold">
                Select Your Ghibli Transformation Package
              </h2>
              <p className="mt-2 opacity-90">
                Choose how many photos you want to transform into beautiful Ghibli art style
              </p>
            </div>
            
            <div className="p-8">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                {packages.map((pkg) => (
                  <div 
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                      selectedPackage?.id === pkg.id 
                        ? 'border-purple-500 bg-purple-50 shadow-md transform scale-105' 
                        : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                      {selectedPackage?.id === pkg.id && (
                        <div className="bg-purple-500 text-white p-1 rounded-full">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 text-3xl font-bold text-gray-900">
                      ₹{pkg.price}
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-500">
                      {pkg.description}
                    </div>
                    
                    <div className="mt-4 flex items-center">
                      <div className="bg-purple-100 p-2 rounded-full mr-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {pkg.photoCount} {pkg.photoCount === 1 ? 'Photo' : 'Photos'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <button
                  onClick={handleContinue}
                  disabled={!selectedPackage}
                  className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 transition-all duration-150"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden divide-y divide-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">What is Ghibli style art?</h3>
              <p className="mt-2 text-gray-500">
                Studio Ghibli is a renowned Japanese animation studio known for its distinctive art style characterized by vibrant colors, detailed backgrounds, and dreamlike quality. Our AI transforms your photos to match this beautiful aesthetic.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">How long does the transformation take?</h3>
              <p className="mt-2 text-gray-500">
                Each photo typically takes 30-60 seconds to transform, depending on the complexity of the image and current server load.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">What types of photos work best?</h3>
              <p className="mt-2 text-gray-500">
                Photos with clear subjects, good lighting, and interesting scenery work best. Landscapes, portraits, and nature shots transform particularly well into Ghibli style.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Can I use the transformed images commercially?</h3>
              <p className="mt-2 text-gray-500">
                The transformed images are for personal use only. If you want to use them commercially, please contact us for licensing options.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">What if I'm not satisfied with the results?</h3>
              <p className="mt-2 text-gray-500">
                If you're not happy with the transformation results, please contact our support team within 7 days of purchase for a refund or to try different photos.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Ghibli Style Transformer. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}