// src/models/ImageTransformation.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IImageTransformation extends Document {
  userId?: string;
  email?: string;
  originalImageUrl?: string;
  transformedImageUrl?: string;
  prompt: string;
  status: 'pending' | 'completed' | 'failed';
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

const ImageTransformationSchema: Schema = new Schema(
  {
    userId: { type: String, sparse: true },
    email: { type: String, sparse: true },
    originalImageUrl: { type: String },
    transformedImageUrl: { type: String },
    prompt: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ['pending', 'completed', 'failed'],
      default: 'pending' 
    },
    credits: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.models.ImageTransformation || 
  mongoose.model<IImageTransformation>('ImageTransformation', ImageTransformationSchema);