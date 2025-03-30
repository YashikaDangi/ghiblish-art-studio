// src/app/api/transform-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Extract base64 data from the data URL
    const base64Data = image.split(',')[1];
    
    if (!base64Data) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    // Call OpenAI API for image transformation
    // Create a Blob from the base64 data and convert it to a File object
    const blob = Buffer.from(base64Data, 'base64');
    const file = new File([blob], 'image.png', { type: 'image/png' });
    
    const response = await openai.images.edit({
      image: file,
      prompt: "Transform this image into Studio Ghibli art style with vibrant colors, soft lighting, and dreamlike quality. Keep the same composition but make it look like it's from a Miyazaki film.",
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    // Get the transformed image
    const transformedImageData = response.data[0].b64_json;
    if (!transformedImageData) {
      throw new Error('Failed to generate transformed image');
    }

    // Create data URL for client side display
    const transformedImage = `data:image/png;base64,${transformedImageData}`;

    return NextResponse.json({ transformedImage });
  } catch (error: any) {
    console.error('Error transforming image:', error);
    
    // Handle specific OpenAI API errors
    if (error.response) {
      const status = error.response.status || 500;
      const message = error.response.data?.error?.message || 'OpenAI API error';
      return NextResponse.json({ error: message }, { status });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to transform image' },
      { status: 500 }
    );
  }
}