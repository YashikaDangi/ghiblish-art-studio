// src/models/Payment.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  orderId: string;
  paymentId: string;
  signature: string;
  amount: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid' | 'failed';
  email: string;
  packageId?: string;
  photoCount?: number;
  type: 'standard' | 'ghibli_transformation';
  createdAt: Date;
  updatedAt: Date;
}

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
    packageId: { type: String, sparse: true }, // For Ghibli transformation packages
    photoCount: { type: Number, sparse: true }, // Number of photos in the package
    type: { 
      type: String, 
      required: true, 
      enum: ['standard', 'ghibli_transformation'],
      default: 'standard'
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);