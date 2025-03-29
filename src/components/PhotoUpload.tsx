'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Link from 'next/link';

interface PhotoUploadProps {
  paymentDetails: {
    orderId: string;
    paymentId: string;
    amount: number;
    email: string;
    imageCount: number;
  };
  onComplete: () => void;
}

export default function PhotoUpload({ paymentDetails, onComplete }: PhotoUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a description for your image');
      return;
    }

    if (uploadedFiles.length === 0) {
      setError('Please upload at least one reference image');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulate upload progress
      for (const file of uploadedFiles) {
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: i
          }));
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      // In a real implementation, you would upload the files to a storage service
      // and get back URLs to the uploaded files
      const mockReferenceImageUrls = uploadedFiles.map(
        (file, index) => `https://storage.example.com/references/${paymentDetails.paymentId}/${index}`
      );

      // Submit the image generation request
      const response = await fetch('/api/image-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: paymentDetails.paymentId,
          email: paymentDetails.email,
          prompt: prompt,
          referenceImageUrls: mockReferenceImageUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit image request');
      }
      
      setSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        onComplete();
      }, 3000);
      
    } catch (error: any) {
      setError(error.message || 'Failed to upload images');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="success-animation mb-6">
          <div className="checkmark-circle">
            <div className="background"></div>
            <div className="checkmark draw"></div>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800">Images Submitted Successfully!</h3>
        <p className="text-gray-600">
          Your request has been received. We'll generate {paymentDetails.imageCount} {paymentDetails.imageCount === 1 ? 'image' : 'images'} based on your prompt and reference photos.
        </p>
        <p className="text-gray-600">
          You'll receive an email at <span className="font-medium">{paymentDetails.email}</span> when your images are ready.
        </p>
        
        <div className="pt-4">
          <Link 
            href="/"
            className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-150"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Upload Reference Images</h3>
      <p className="text-gray-600 mb-6">
        Please upload reference images and provide a description of what you'd like us to create. 
        We'll generate {paymentDetails.imageCount} {paymentDetails.imageCount === 1 ? 'image' : 'images'} based on your input.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
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

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Image Description
          </label>
          <textarea
            id="prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you'd like us to create in detail (style, mood, elements, etc.)"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reference Images
          </label>

          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Uploaded Files:</h4>
            <ul className="divide-y divide-gray-200 bg-gray-50 rounded-md">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="px-4 py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center">
                    {uploadProgress[file.name] > 0 && uploadProgress[file.name] < 100 ? (
                      <span className="text-xs text-gray-500">{uploadProgress[file.name]}%</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-5 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => onComplete()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Skip This Step
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
      
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