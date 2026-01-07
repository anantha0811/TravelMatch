import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/RefreshToken.js";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export interface JWTPayload {
  userId: string;
  email?: string;
  mobile?: string;
}

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const generateRefreshToken = async (
  userId: string
): Promise<string> => {
  const token = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });

  // Store refresh token in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await RefreshToken.create({
    userId: new mongoose.Types.ObjectId(userId),
    token,
    expiresAt,
  });

  return token;
};

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const verifyRefreshToken = async (
  token: string
): Promise<JWTPayload> => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;

    // Check if refresh token exists in database
    const refreshToken = await RefreshToken.findOne({ token });

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

export const deleteRefreshToken = async (token: string): Promise<void> => {
  await RefreshToken.deleteOne({ token });
};

export const deleteUserRefreshTokens = async (
  userId: string
): Promise<void> => {
  await RefreshToken.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
};
