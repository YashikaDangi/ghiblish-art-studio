// src/components/ImageTransformer.tsx
'use client';

import { useState, useRef } from 'react';

export default function ImageTransformer() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Check file size (limit to 4MB)
    if (file.size > 4 * 1024 * 1024) {
      setError('File size should be less than 4MB');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImage(reader.result as string);
      setTransformedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleTransform = async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/transform-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: originalImage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transform image');
      }

      const data = await response.json();
      setTransformedImage(data.transformedImage);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!transformedImage) return;
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = transformedImage;
    link.download = 'ghibli-style-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setTransformedImage(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-6 px-8 text-white">
        <h2 className="text-3xl font-bold">Ghibli Style Image Transformer</h2>
        <p className="mt-2 opacity-90">
          Transform your photos into Studio Ghibli art style
        </p>
      </div>

      <div className="p-8">
        {error && (
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 mb-6">
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

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Your Image
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mt-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or JPEG (Max 4MB)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {originalImage && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Original Image</h3>
                <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Transformed Image</h3>
                <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <svg className="animate-spin h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">Transforming image...</p>
                    </div>
                  ) : transformedImage ? (
                    <img
                      src={transformedImage}
                      alt="Transformed"
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">Click 'Transform' to generate</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              {!transformedImage && (
                <button
                  onClick={handleTransform}
                  disabled={isLoading || !originalImage}
                  className="flex-grow py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-150"
                >
                  {isLoading ? 'Transforming...' : 'Transform to Ghibli Style'}
                </button>
              )}

              {transformedImage && (
                <button
                  onClick={handleDownload}
                  className="flex-grow py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-150"
                >
                  Download Image
                </button>
              )}

              <button
                onClick={handleReset}
                className="py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Note: This service uses credits to transform images. See pricing details for more information.</p>
        </div>
      </div>
    </div>
  );
}