"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Photo {
  _id: string;
  originalName: string;
  fileName: string;
  size: number;
  type: string;
  path: string;
  uploadedAt: string;
}

interface PhotoGalleryResponse {
  photos: Photo[];
  packageDetails: {
    name: string;
    photoLimit: number;
    description: string;
  };
  uploadedCount: number;
}

export default function PhotoGallery() {
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [gallery, setGallery] = useState<PhotoGalleryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGallery = async () => {
    if (!email.trim() || !orderId.trim()) {
      setError("Please enter both email and order ID to view your gallery");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/photo-gallery?email=${encodeURIComponent(
          email
        )}&orderId=${encodeURIComponent(orderId)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch photo gallery");
      }

      setGallery(data);
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8 text-white">
          <h2 className="text-3xl font-bold">Your Photo Gallery</h2>
          <p className="mt-2 opacity-90">View all your uploaded photos</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!gallery ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="orderId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Order ID
                  </label>
                  <input
                    type="text"
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter your order ID"
                  />
                </div>
              </div>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={fetchGallery}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    "View Gallery"
                  )}
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Package: {gallery.packageDetails.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {gallery.packageDetails.description}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <span className="text-sm text-gray-500">
                      {gallery.uploadedCount} of{" "}
                      {gallery.packageDetails.photoLimit} photos used
                    </span>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (gallery.uploadedCount /
                              gallery.packageDetails.photoLimit) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {gallery.photos.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No photos
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't uploaded any photos yet.
                  </p>
                  <div className="mt-6">
                    <Link
                      href={`/upload-photos?orderId=${orderId}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Upload Photos
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Your Photos ({gallery.photos.length})
                    </h3>
                    {gallery.uploadedCount <
                      gallery.packageDetails.photoLimit && (
                      <Link
                        href={`/upload-photos?orderId=${orderId}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Upload More
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.photos.map((photo) => (
                      <div
                        key={photo._id}
                        className="group relative bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                          <img
                            src={photo.path}
                            alt={photo.originalName}
                            className="w-full h-full object-center object-cover group-hover:opacity-90"
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-xs text-gray-700 truncate">
                            {photo.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {Math.round(photo.size / 1024)} KB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
