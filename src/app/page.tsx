// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PackageOption {
  id: string;
  name: string;
  photoCount: number;
  price: number;
  description: string;
  icon: string;
}

export default function Home() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);
  const [isHovering, setIsHovering] = useState<string | null>(null);

  const packages: PackageOption[] = [
    {
      id: 'basic',
      name: 'Single Photo',
      photoCount: 1,
      price: 50,
      description: 'Perfect for trying out the service',
      icon: '🖼️'
    },
    {
      id: 'standard',
      name: 'Photo Pack',
      photoCount: 5,
      price: 200,
      description: 'Most popular choice',
      icon: '📸'
    },
    {
      id: 'premium',
      name: 'Studio Collection',
      photoCount: 15,
      price: 500,
      description: 'Best value for true fans',
      icon: '✨'
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with playful typography */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              Ghibli Style
            </span>
            <br />
            <span className="text-4xl sm:text-5xl text-gray-800">Photo Transformer</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your photos into magical Studio Ghibli-inspired artwork with our AI technology
          </p>
        </div>

        {/* Package Selection - Featured prominently */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Choose Your Magical Package
          </h2>
          
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                onMouseEnter={() => setIsHovering(pkg.id)}
                onMouseLeave={() => setIsHovering(null)}
                className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                  selectedPackage?.id === pkg.id 
                    ? 'ring-4 ring-purple-400 transform scale-105' 
                    : isHovering === pkg.id ? 'transform scale-102 shadow-lg' : 'shadow-md'
                }`}
              >
                <div className={`p-8 h-full flex flex-col ${
                  selectedPackage?.id === pkg.id 
                    ? 'bg-gradient-to-br from-purple-100 to-pink-100' 
                    : 'bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50'
                }`}>
                  <div className="text-center mb-4">
                    <span className="text-4xl">{pkg.icon}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">{pkg.name}</h3>
                  
                  <div className="text-center mb-4">
                    <span className="text-4xl font-bold text-gray-900">₹{pkg.price}</span>
                  </div>
                  
                  <div className="text-center mb-4 flex-grow">
                    <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                      {pkg.photoCount} {pkg.photoCount === 1 ? 'Photo' : 'Photos'}
                    </span>
                    <p className="mt-3 text-gray-600">{pkg.description}</p>
                  </div>
                  
                  {selectedPackage?.id === pkg.id && (
                    <div className="absolute top-4 right-4 bg-purple-500 text-white p-1 rounded-full">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <button
              onClick={handleContinue}
              disabled={!selectedPackage}
              className="px-8 py-4 text-lg border border-transparent rounded-full shadow-lg text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
            >
              {selectedPackage ? `Get Your ${selectedPackage.name}` : 'Select a Package'}
            </button>
          </div>
        </div>

        {/* Before & After Visualization */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">See the Magic</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden shadow-lg transition-transform hover:transform hover:scale-102">
                <div className="aspect-w-4 aspect-h-3 bg-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="text-white font-medium">Your Photo</div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-1 text-sm font-medium text-gray-800">
                  Original Photo
                </span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden shadow-lg transition-transform hover:transform hover:scale-102">
                <div className="aspect-w-4 aspect-h-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 animate-pulse"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="text-white font-medium">Ghibli Magic</div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <span className="inline-flex items-center rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-800">
                  Transformed by AI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cute Footer */}
        <footer className="mt-16 text-center">
          <div className="inline-flex items-center justify-center space-x-2 text-purple-500 text-lg font-medium">
            <span>✨</span>
            <span>Made with magic</span>
            <span>✨</span>
          </div>
          <p className="mt-2 text-gray-500 text-sm">
            © {new Date().getFullYear()} Ghibli Style Transformer
          </p>
        </footer>
      </div>
    </div>
  );
}