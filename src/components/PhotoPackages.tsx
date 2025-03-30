// src/components/PhotoPackages.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PackageOption {
  id: string;
  name: string;
  photoCount: number;
  price: number;
  description: string;
}

export default function PhotoPackages() {
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
  );
}