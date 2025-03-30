'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface UploadState {
  uploading: boolean;
  success: boolean;
  error: string;
  uploadedCount: number;
  totalAllowed: number;
  paymentVerified: boolean;
}

export default function UploadPhotos() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    success: false,
    error: '',
    uploadedCount: 0,
    totalAllowed: 0,
    paymentVerified: false,
  });
  const [verifying, setVerifying] = useState(true);

  // Verify payment and get package details
  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        setVerifying(false);
        setUploadState(prev => ({
          ...prev,
          error: 'No order ID provided. Please make a payment first.',
          paymentVerified: false,
        }));
        return;
      }

      try {
        const response = await fetch(`/api/verify-package?orderId=${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify payment');
        }

        setEmail(data.email);
        setUploadState(prev => ({
          ...prev,
          totalAllowed: data.photoLimit,
          uploadedCount: data.uploadedCount || 0,
          paymentVerified: true,
        }));
      } catch (error: any) {
        setUploadState(prev => ({
          ...prev,
          error: error.message || 'Payment verification failed',
          paymentVerified: false,
        }));
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [orderId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert FileList to Array
      const fileArray = Array.from(e.target.files);
      
      // Check if adding these files would exceed the limit
      const totalFiles = fileArray.length + uploadState.uploadedCount;
      if (totalFiles > uploadState.totalAllowed) {
        setUploadState(prev => ({
          ...prev,
          error: `You can only upload ${uploadState.totalAllowed} photos in total. You've already uploaded ${uploadState.uploadedCount}.`
        }));
        return;
      }
      
      setFiles(fileArray);
      setUploadState(prev => ({ ...prev, error: '' }));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setUploadState(prev => ({
        ...prev,
        error: 'Please select files to upload',
      }));
      return;
    }

    // Check if adding these files would exceed the limit
    if (files.length + uploadState.uploadedCount > uploadState.totalAllowed) {
      setUploadState(prev => ({
        ...prev,
        error: `You can only upload ${uploadState.totalAllowed} photos in total. You've already uploaded ${uploadState.uploadedCount}.`
      }));
      return;
    }

    setUploadState(prev => ({
      ...prev,
      uploading: true,
      error: '',
    }));

    const formData = new FormData();
    formData.append('orderId', orderId || '');
    formData.append('email', email);
    
    files.forEach(file => {
      formData.append('photos', file);
    });

    try {
      const response = await fetch('/api/upload-photos', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload photos');
      }

      setUploadState(prev => ({
        ...prev,
        success: true,
        uploadedCount: prev.uploadedCount + files.length,
      }));
      
      // Clear selected files after successful upload
      setFiles([]);
      
    } catch (error: any) {
      setUploadState(prev => ({
        ...prev,
        error: error.message || 'Something went wrong during upload',
      }));
    } finally {
      setUploadState(prev => ({
        ...prev,
        uploading: false,
      }));
    }
  };

  const remainingUploads = uploadState.totalAllowed - uploadState.uploadedCount;

  if (verifying) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-white shadow-xl rounded-xl p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Verifying your payment...</h2>
          <p className="mt-2 text-gray-600">Please wait while we verify your payment details.</p>
        </div>
      </div>
    );
  }

  if (!uploadState.paymentVerified) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-white shadow-xl rounded-xl p-8">
          <div className="text-center">
            <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Payment Verification Failed</h2>
            <p className="mt-2 text-gray-600">{uploadState.error || 'We could not verify your payment. Please try again.'}</p>
            <div className="mt-8">
              <Link 
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Payment Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8 text-white">
          <h2 className="text-3xl font-bold">Upload Your Photos</h2>
          <p className="mt-2 opacity-90">
            You can upload {uploadState.totalAllowed} photos with your package
          </p>
        </div>
        
        <div className="p-8">
          {uploadState.success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Photos uploaded successfully!
                  </p>
                </div>
              </div>
            </div>
          )}

          {uploadState.error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{uploadState.error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upload Status</h3>
            <div className="mt-2 flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${(uploadState.uploadedCount / uploadState.totalAllowed) * 100}%` }}
                ></div>
              </div>
              <div className="ml-4 text-sm text-gray-600 whitespace-nowrap">
                {uploadState.uploadedCount} / {uploadState.totalAllowed}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {remainingUploads > 0 
                ? `You can upload ${remainingUploads} more photo${remainingUploads !== 1 ? 's' : ''}.` 
                : 'You have used all your photo uploads.'}
            </p>
          </div>

          {remainingUploads > 0 ? (
            <form onSubmit={handleUpload}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Photos to Upload
                  </label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="photo-upload"
                      disabled={uploadState.uploading || remainingUploads <= 0}
                    />
                    <label 
                      htmlFor="photo-upload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">
                        Click to select photos, or drag and drop them here
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                      <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                        {files.map((file, index) => (
                          <li key={index} className="px-4 py-3 flex items-center text-sm">
                            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{file.name}</span>
                            <span className="ml-2 text-gray-500">({Math.round(file.size / 1024)} KB)</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={uploadState.uploading || files.length === 0 || remainingUploads <= 0}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-150"
                >
                  {uploadState.uploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      Upload Photos
                      <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">All photos uploaded</h3>
              <p className="mt-1 text-sm text-gray-500">
                You've used all {uploadState.totalAllowed} photo uploads from your package.
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Purchase Another Package
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-center space-x-4">
        <Link 
          href="/"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Payment
        </Link>
        
        <Link 
          href="/photo-gallery"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          View My Gallery
        </Link>
      </div>
    </div>
  );
}