// src/app/image-transformer/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageTransformer from '@/components/ImageTransformer';

export default function ImageTransformerPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <ImageTransformer />
      
      <div className="mt-8 flex justify-center">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
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