import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  orderId: string;
  paymentId: string;
  signature: string;
  amount: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid' | 'failed';
  email: string;
  imageCount?: number;  // Added field for DreamChant
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
    imageCount: { type: Number }, // For DreamChant - number of images purchased
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);