export interface User {
  id: string;
  email?: string;
  mobile?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  isEmailVerified: boolean;
  isMobileVerified?: boolean;
  isProfileComplete?: boolean;
  profileCompletionPercentage?: number;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthMethod = "email" | "mobile" | "google" | "apple";
