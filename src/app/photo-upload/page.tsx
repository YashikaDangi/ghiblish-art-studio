'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PhotoData {
  id: string;
  file: File;
  previewUrl: string;
  transformedImage: string | null;
  isTransforming: boolean;
  error: string | null;
}

export default function PhotoUploadPage() {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [maxPhotos, setMaxPhotos] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentlyTransforming, setCurrentlyTransforming] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // For testing purposes - you can set a default value
    setMaxPhotos(5);

    // Retrieve payment details from session storage
    const storedPaymentDetails = sessionStorage.getItem('paymentDetails');
    
    if (!storedPaymentDetails) {
      // If no payment details, we'll just use default for testing
      console.log("No payment details found in session storage - using default values for testing");
      // Uncomment this to enforce the actual flow:
      // router.push('/');
      // return;
    } else {
      try {
        const paymentDetails = JSON.parse(storedPaymentDetails);
        const packageInfo = paymentDetails.packageInfo;
        
        if (!packageInfo || !packageInfo.photoCount) {
          console.warn("Invalid package information");
        } else {
          setMaxPhotos(packageInfo.photoCount);
          setEmail(paymentDetails.email || '');
        }
      } catch (error) {
        console.error('Error parsing payment details:', error);
      }
    }
  }, []);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      // Revoke all created object URLs when component unmounts
      photos.forEach(photo => {
        if (photo.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(photo.previewUrl);
        }
      });
    };
  }, [photos]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    // Check if adding more files would exceed the limit
    if (photos.length + fileList.length > maxPhotos) {
      alert(`You can only upload a maximum of ${maxPhotos} photos. You've selected ${photos.length + fileList.length} photos.`);
      return;
    }

    const newPhotos: PhotoData[] = [];
    
    Array.from(fileList).forEach(file => {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert(`File "${file.name}" is not an image. Please upload only image files.`);
        return;
      }
      
      // Check file size (limit to 4MB)
      if (file.size > 4 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 4MB size limit.`);
        return;
      }
      
      // Create an object URL for the file
      const previewUrl = URL.createObjectURL(file);
      
      newPhotos.push({
        id: Math.random().toString(36).substring(2, 11),
        file,
        previewUrl,
        transformedImage: null,
        isTransforming: false,
        error: null
      });
    });
    
    if (newPhotos.length > 0) {
      setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(prevPhotos => {
      // Find the photo to remove
      const photoToRemove = prevPhotos.find(p => p.id === id);
      
      // Revoke object URL if it's a blob URL
      if (photoToRemove && photoToRemove.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoToRemove.previewUrl);
      }
      
      // Remove the photo from the array
      return prevPhotos.filter(photo => photo.id !== id);
    });
  };

  const transformPhoto = async (photo: PhotoData) => {
    // Update the photo's state to indicate transformation is in progress
    setPhotos(prevPhotos => 
      prevPhotos.map(p => 
        p.id === photo.id ? { ...p, isTransforming: true, error: null } : p
      )
    );
    
    try {
      // For demonstration, we'll simulate a transformation
      console.log("Starting transformation for", photo.file.name);
      
      // In a real implementation, you would send the image to your API
      // const response = await fetch('/api/transform-image', {...})
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate a transformed image (in reality, this would come from your API)
      // For demo, we're just using the same image URL
      const simulatedTransformedImage = photo.previewUrl;
      
      // Update the photo with the transformed image
      setPhotos(prevPhotos => 
        prevPhotos.map(p => 
          p.id === photo.id ? 
            { 
              ...p, 
              transformedImage: simulatedTransformedImage,
              isTransforming: false 
            } : p
        )
      );
      
      console.log("Transformation completed for", photo.file.name);
    } catch (error: any) {
      console.error("Transformation error:", error);
      
      // Update the photo to indicate transformation failed
      setPhotos(prevPhotos => 
        prevPhotos.map(p => 
          p.id === photo.id ? 
            { 
              ...p, 
              isTransforming: false, 
              error: error.message || 'Failed to transform image' 
            } : p
        )
      );
    }
  };

  const handleTransformAll = async () => {
    if (currentlyTransforming) return;
    
    setCurrentlyTransforming(true);
    
    // Filter photos that haven't been transformed and don't have errors
    const photosToTransform = photos.filter(p => !p.transformedImage && !p.isTransforming);
    
    if (photosToTransform.length === 0) {
      setCurrentlyTransforming(false);
      return;
    }
    
    setIsLoading(true);
    
    // Transform photos one by one
    for (const photo of photosToTransform) {
      await transformPhoto(photo);
    }
    
    setIsLoading(false);
    setCurrentlyTransforming(false);
  };

  const handleDownload = (photo: PhotoData) => {
    if (!photo.transformedImage) return;
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = photo.transformedImage;
    link.download = `ghibli-${photo.file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    // Get all transformed photos
    const transformedPhotos = photos.filter(p => p.transformedImage);
    
    if (transformedPhotos.length === 0) return;
    
    // Download each transformed photo
    transformedPhotos.forEach(photo => {
      handleDownload(photo);
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-6 px-8 text-white">
          <h2 className="text-3xl font-bold">
            Upload Your Photos
          </h2>
          <p className="mt-2 opacity-90">
            Transform up to {maxPhotos} photos into beautiful Ghibli art style
          </p>
          <div className="mt-4 bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <div className="flex items-center text-sm">
              <svg className="mr-2 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Uploaded: {photos.length} / {maxPhotos} photos</span>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          {photos.length < maxPhotos && (
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700 mb-4">
                Upload Your Photos
              </label>
              <div 
                className={`flex flex-col items-center justify-center w-full h-52 border-2 border-dashed ${isDragging ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:bg-gray-50'} rounded-lg cursor-pointer transition-colors duration-200`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileInputChange}
                />
                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="text-lg font-medium text-gray-700">
                  Drop your images here, or <span className="text-purple-600">browse</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  You can upload up to {maxPhotos} photos (Max 4MB each)
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supported formats: PNG, JPG, JPEG
                </p>
                <p className="mt-2 text-sm text-purple-600">
                  {maxPhotos - photos.length} photos remaining
                </p>
              </div>
            </div>
          )}
          
          {photos.length > 0 && (
            <div className="space-y-8">
              <div className="flex flex-wrap justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Your Photos</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={handleTransformAll}
                    disabled={isLoading || photos.every(p => p.transformedImage || p.isTransforming)}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Transforming...
                      </div>
                    ) : (
                      'Transform All Photos'
                    )}
                  </button>
                  <button
                    onClick={handleDownloadAll}
                    disabled={!photos.some(p => p.transformedImage)}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Download All
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map(photo => (
                  <div key={photo.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
                      <div className="truncate text-sm font-medium text-gray-700" title={photo.file.name}>
                        {photo.file.name}
                      </div>
                      <button
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1">
                      <div className="relative h-40 bg-gray-100">
                        <img
                          src={photo.previewUrl}
                          alt="Original"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2">
                          Original
                        </div>
                      </div>
                      
                      <div className="relative h-40 bg-gray-100 flex items-center justify-center">
                        {photo.isTransforming ? (
                          <div className="flex flex-col items-center justify-center">
                            <svg className="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-2 text-xs text-gray-500">Transforming...</p>
                          </div>
                        ) : photo.transformedImage ? (
                          <>
                            <img
                              src={photo.transformedImage}
                              alt="Transformed"
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2">
                              Ghibli Style
                            </div>
                          </>
                        ) : photo.error ? (
                          <div className="text-center p-2">
                            <svg className="mx-auto h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="mt-1 text-xs text-red-500">Error: {photo.error}</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <button
                              onClick={() => transformPhoto(photo)}
                              className="py-1 px-3 text-xs border border-transparent rounded-md shadow-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                              Transform
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between px-4 py-2 bg-gray-50 border-t">
                      <div className="text-xs text-gray-500">
                        {(photo.file.size / 1024).toFixed(1)} KB
                      </div>
                      {photo.transformedImage && (
                        <button
                          onClick={() => handleDownload(photo)}
                          className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center"
                        >
                          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}