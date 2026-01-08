"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import {
  loginWithEmail,
  sendEmailOTP,
  verifyEmailOTP,
  sendMobileOTP,
  verifyMobileOTP,
} from "@/lib/api/auth";
import { Mail, Lock, Phone } from "lucide-react";

type LoginMethod = "email-password" | "email-otp" | "mobile-otp";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [method, setMethod] = useState<LoginMethod>("email-password");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginWithEmail({ email, password });
      if (response.success) {
        login(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );
        toast.success("Welcome back! 🎉");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmailOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await sendEmailOTP(email);
      if (response.success) {
        setOtpSent(true);
        toast.success("OTP sent to your email!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await verifyEmailOTP({ email, otp });
      if (response.success) {
        login(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );
        toast.success("Welcome back! 🎉");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMobileOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await sendMobileOTP(mobile);
      if (response.success) {
        setOtpSent(true);
        toast.success("OTP sent to your mobile!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMobileOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await verifyMobileOTP({ mobile, otp });
      if (response.success) {
        login(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );
        toast.success("Welcome back! 🎉");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">✈️</span>
            </div>
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              TravelTinder
            </h1>
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center p-4 pt-28 pb-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-lg">
              Sign in to continue your adventure
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-8">
            {/* Method Selector */}
            <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => {
                  setMethod("email-password");
                  setOtpSent(false);
                }}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                  method === "email-password"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Password
              </button>
              <button
                onClick={() => {
                  setMethod("email-otp");
                  setOtpSent(false);
                }}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                  method === "email-otp"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Email OTP
              </button>
              <button
                onClick={() => {
                  setMethod("mobile-otp");
                  setOtpSent(false);
                }}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                  method === "mobile-otp"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Mobile OTP
              </button>
            </div>

            {/* Email/Password Login */}
            {method === "email-password" && (
              <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
                <Input
                  type="email"
                  label="Email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<Mail size={20} />}
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  icon={<Lock size={20} />}
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                  size="lg"
                >
                  Sign In
                </Button>
              </form>
            )}

            {/* Email OTP Login */}
            {method === "email-otp" && !otpSent && (
              <form onSubmit={handleSendEmailOTP} className="space-y-4">
                <Input
                  type="email"
                  label="Email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<Mail size={20} />}
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                  size="lg"
                >
                  Send OTP
                </Button>
              </form>
            )}

            {method === "email-otp" && otpSent && (
              <form onSubmit={handleVerifyEmailOTP} className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Enter the 6-digit code sent to <strong className="font-semibold">{email}</strong>
                </p>
                <Input
                  type="text"
                  label="OTP Code"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                  size="lg"
                >
                  Verify & Sign In
                </Button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-sm text-pink-500 hover:text-pink-600 font-medium"
                >
                  Change email
                </button>
              </form>
            )}

            {/* Mobile OTP Login */}
            {method === "mobile-otp" && !otpSent && (
              <form onSubmit={handleSendMobileOTP} className="space-y-4">
                <Input
                  type="tel"
                  label="Mobile Number"
                  placeholder="+1234567890"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  icon={<Phone size={20} />}
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                  size="lg"
                >
                  Send OTP
                </Button>
              </form>
            )}

            {method === "mobile-otp" && otpSent && (
              <form onSubmit={handleVerifyMobileOTP} className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Enter the 6-digit code sent to <strong className="font-semibold">{mobile}</strong>
                </p>
                <Input
                  type="text"
                  label="OTP Code"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                  size="lg"
                >
                  Verify & Sign In
                </Button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-sm text-pink-500 hover:text-pink-600 font-medium"
                >
                  Change mobile number
                </button>
              </form>
            )}

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-pink-500 hover:text-pink-600"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
