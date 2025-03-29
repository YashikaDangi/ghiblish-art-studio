import mongoose, { Document, Schema } from 'mongoose';

export interface IImageRequest extends Document {
  paymentId: string;
  email: string;
  prompt: string;
  imageCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  referenceImages?: string[];
  generatedImages?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ImageRequestSchema: Schema = new Schema(
  {
    paymentId: { type: String, required: true, ref: 'Payment' },
    email: { type: String, required: true },
    prompt: { type: String, required: true },
    imageCount: { type: Number, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending' 
    },
    referenceImages: { type: [String] },
    generatedImages: { type: [String] },
  },
  { timestamps: true }
);

export default mongoose.models.ImageRequest || 
  mongoose.model<IImageRequest>('ImageRequest', ImageRequestSchema);