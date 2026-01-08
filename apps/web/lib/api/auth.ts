import { apiClient } from "./client";

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email?: string;
      mobile?: string;
      firstName?: string;
      lastName?: string;
      profilePicture?: string;
      isEmailVerified: boolean;
      isMobileVerified?: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OTPVerifyData {
  email?: string;
  mobile?: string;
  otp: string;
  firstName?: string;
  lastName?: string;
}

// Email/Password Authentication
export const registerWithEmail = async (
  data: RegisterData
): Promise<AuthResponse> => {
  const response = await apiClient.post("/api/auth/register/email", data);
  return response.data;
};

export const loginWithEmail = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post("/api/auth/login/email", data);
  return response.data;
};

// Email OTP Authentication
export const sendEmailOTP = async (email: string): Promise<any> => {
  const response = await apiClient.post("/api/auth/otp/email/send", { email });
  return response.data;
};

export const verifyEmailOTP = async (
  data: OTPVerifyData
): Promise<AuthResponse> => {
  const response = await apiClient.post("/api/auth/otp/email/verify", data);
  return response.data;
};

// Mobile OTP Authentication
export const sendMobileOTP = async (mobile: string): Promise<any> => {
  const response = await apiClient.post("/api/auth/otp/mobile/send", { mobile });
  return response.data;
};

export const verifyMobileOTP = async (
  data: OTPVerifyData
): Promise<AuthResponse> => {
  const response = await apiClient.post("/api/auth/otp/mobile/verify", data);
  return response.data;
};

// OAuth
export const googleAuth = async (idToken: string): Promise<AuthResponse> => {
  const response = await apiClient.post("/api/auth/oauth/google", { idToken });
  return response.data;
};

export const appleAuth = async (data: {
  identityToken: string;
  appleId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}): Promise<AuthResponse> => {
  const response = await apiClient.post("/api/auth/oauth/apple", data);
  return response.data;
};

// Token Management
export const refreshToken = async (refreshToken: string): Promise<any> => {
  const response = await apiClient.post("/api/auth/refresh", { refreshToken });
  return response.data;
};

export const logout = async (refreshToken: string): Promise<any> => {
  const response = await apiClient.post("/api/auth/logout", { refreshToken });
  return response.data;
};

export const logoutAll = async (): Promise<any> => {
  const response = await apiClient.post("/api/auth/logout/all");
  return response.data;
};

// Profile
export const getProfile = async (): Promise<any> => {
  const response = await apiClient.get("/api/auth/profile");
  return response.data;
};
