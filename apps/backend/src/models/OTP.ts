import mongoose, { Document, Schema } from "mongoose";

export interface IOTP extends Document {
  identifier: string; // email or mobile
  otp: string;
  type: "email" | "mobile";
  purpose: "login" | "verification";
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>({
  identifier: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["email", "mobile"],
    required: true,
  },
  purpose: {
    type: String,
    enum: ["login", "verification"],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index - MongoDB will automatically delete expired documents
  },
  attempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster lookups
OTPSchema.index({ identifier: 1, type: 1 });

export const OTP = mongoose.model<IOTP>("OTP", OTPSchema);
