import mongoose, { Document, Schema } from 'mongoose';

interface UploadedPhoto {
  originalName: string;
  fileName: string;
  size: number;
  type: string;
  path: string;
  uploadedAt?: Date;
}

export interface IPayment extends Document {
  orderId: string;
  paymentId: string;
  signature: string;
  amount: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid' | 'failed';
  email: string;
  packageDetails: {
    name: string;
    photoLimit: number;
    description?: string;
  };
  photosUploaded: number;
  uploads: UploadedPhoto[];
  createdAt: Date;
  updatedAt: Date;
}

const UploadedPhotoSchema = new Schema({
  originalName: { type: String, required: true },
  fileName: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  path: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const PaymentSchema: Schema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String, sparse: true },
    signature: { type: String, sparse: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'INR' },
    status: { 
      type: String, 
      required: true, 
      enum: ['created', 'attempted', 'paid', 'failed'],
      default: 'created' 
    },
    email: { type: String, required: true },
    packageDetails: {
      name: { type: String, required: true },
      photoLimit: { type: Number, required: true },
      description: { type: String }
    },
    photosUploaded: { type: Number, default: 0 },
    uploads: [UploadedPhotoSchema]
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);