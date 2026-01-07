import { OTP } from "../models/OTP.js";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 3;

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createOTP = async (
  identifier: string,
  type: "email" | "mobile",
  purpose: "login" | "verification"
): Promise<string> => {
  // Delete any existing OTPs for this identifier
  await OTP.deleteMany({ identifier, type });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await OTP.create({
    identifier,
    otp,
    type,
    purpose,
    expiresAt,
    attempts: 0,
  });

  return otp;
};

export const verifyOTP = async (
  identifier: string,
  otp: string,
  type: "email" | "mobile"
): Promise<boolean> => {
  const otpRecord = await OTP.findOne({ identifier, type });

  if (!otpRecord) {
    throw new Error("OTP not found or expired");
  }

  if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
    await OTP.deleteOne({ _id: otpRecord._id });
    throw new Error("Maximum OTP attempts exceeded");
  }

  // Increment attempts
  otpRecord.attempts += 1;
  await otpRecord.save();

  if (otpRecord.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  // OTP is valid, delete it
  await OTP.deleteOne({ _id: otpRecord._id });
  return true;
};

export const isOTPValid = async (
  identifier: string,
  type: "email" | "mobile"
): Promise<boolean> => {
  const otpRecord = await OTP.findOne({ identifier, type });
  return !!otpRecord && otpRecord.expiresAt > new Date();
};
