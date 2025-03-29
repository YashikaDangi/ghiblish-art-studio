import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface PaymentDetails {
  orderId: string;
  paymentId: string;
  amount: number;
  email: string;
  imageCount: number;
}

interface UploadedImage {
  file: File;
  preview: string;
  name: string;
  status: 'ready' | 'processing' | 'completed';
}

interface ImageUploadProps {
  paymentDetails: PaymentDetails;
}

const ImageUpload = ({ paymentDetails }: ImageUploadProps) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [processingComplete, setProcessingComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    
    // Check if user selected more files than they paid for
    if (files.length > paymentDetails.imageCount) {
      setError(`You can only upload ${paymentDetails.imageCount} images. Please select fewer images.`);
      return;
    }
    
    setError('');
    
    // Preview the selected images
    const imagePromises = files.map(file => {
      return new Promise<UploadedImage>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (!e.target || typeof e.target.result !== 'string') {
            reject(new Error('Failed to read file'));
            return;
          }
          resolve({
            file,
            preview: e.target.result,
            name: file.name,
            status: 'ready'
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(imagePromises)
      .then(images => {
        setUploadedImages(images);
      })
      .catch(error => {
        setError('Error loading image previews');
        console.error('Error loading previews:', error);
      });
  };

  const processImages = async () => {
    if (uploadedImages.length === 0) {
      setError('Please select images to upload');
      return;
    }
    
    setUploading(true);
    setError('');
    
    // Update status for all images
    setUploadedImages(prev => 
      prev.map(img => ({...img, status: 'processing'}))
    );
    
    // Simulate processing time for each image
    for (let i = 0; i < uploadedImages.length; i++) {
      // Wait 1-3 seconds per image to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Update status for this image
      setUploadedImages(prev => 
        prev.map((img, index) => 
          index === i ? {...img, status: 'completed'} : img
        )
      );
    }
    
    // All images processed
    setUploading(false);
    setProcessingComplete(true);
  };

  const getStatusIndicator = (status:any) => {
    switch (status) {
      case 'ready':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            Ready
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Complete
          </span>
        );
      default:
        return null;
    }
  };

  const handleSelectFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (processingComplete) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Images Dreamchanted!</h2>
          <p className="text-gray-600 mb-8">
            Your {uploadedImages.length} images have been successfully transformed into magical art.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {uploadedImages.map((img, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                <img src={img.preview} alt={`Dreamchanted image ${index + 1}`} className="w-full h-48 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <button className="text-white text-sm hover:underline">Download</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setUploadedImages([]);
                setProcessingComplete(false);
              }}
              className="flex-1 py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md"
            >
              Process More Images
            </button>
            
            <Link
              href="/"
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Photos</h2>
      <p className="text-gray-600 mb-6">
        You've purchased {paymentDetails.imageCount} dreamchanted image{paymentDetails.imageCount > 1 ? 's' : ''}. 
        Upload your photos to transform them into magical art.
      </p>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />
      
      {uploadedImages.length === 0 ? (
        <div 
          onClick={handleSelectFiles}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 mb-6"
        >
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">Click to select images or drag and drop them here</p>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Selected Images ({uploadedImages.length}/{paymentDetails.imageCount})</h3>
            <button 
              onClick={handleSelectFiles}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Change selection
            </button>
          </div>
          
          <div className="space-y-3 mb-4">
            {uploadedImages.map((img, index) => (
              <div key={index} className="flex items-center p-3 border rounded-lg">
                <div className="h-12 w-12 rounded overflow-hidden mr-3">
                  <img src={img.preview} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{img.name}</p>
                  <p className="text-xs text-gray-500">{Math.round(img.file.size / 1024)} KB</p>
                </div>
                <div>
                  {getStatusIndicator(img.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex space-x-4">
        <button
          onClick={() => window.history.back()}
          className="flex-1 py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md"
          disabled={uploading}
        >
          Back
        </button>
        
        <button
          onClick={processImages}
          disabled={uploadedImages.length === 0 || uploading}
          className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Transform Images"
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;