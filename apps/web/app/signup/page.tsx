"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { registerWithEmail, sendEmailOTP, verifyEmailOTP } from "@/lib/api/auth";
import { Mail, Lock, User, Chrome, Apple } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [method, setMethod] = useState<"password" | "otp">("password");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState("");

  const handleEmailPasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerWithEmail({
        email,
        password,
        firstName,
        lastName,
      });
      
      if (response.success) {
        toast.success("Account created! Please verify your email.");
        // For now, redirect to login. In production, you'd show OTP verification
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
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

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await verifyEmailOTP({
        email,
        otp,
        firstName,
        lastName,
      });
      if (response.success) {
        login(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );
        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast("Google OAuth coming soon!", { icon: "🚧" });
  };

  const handleAppleSignup = () => {
    toast("Apple Sign In coming soon!", { icon: "🚧" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">✈️</span>
            </div>
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              TravelTinder
            </h1>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center p-4 pt-24 pb-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-3">
              Join TravelTinder
            </h1>
            <p className="text-gray-600 text-lg">
              Start your adventure
            </p>
          </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8">
          {/* Method Selector */}
          <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => {
                setMethod("password");
                setOtpSent(false);
              }}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                method === "password"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              With Password
            </button>
            <button
              onClick={() => {
                setMethod("otp");
                setOtpSent(false);
              }}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                method === "otp"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              With OTP
            </button>
          </div>

          {/* Password Signup */}
          {method === "password" && (
            <form onSubmit={handleEmailPasswordSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  icon={<User size={20} />}
                />
                <Input
                  type="text"
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
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
              <Input
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                icon={<Lock size={20} />}
              />
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                size="lg"
              >
                Create Account
              </Button>
            </form>
          )}

          {/* OTP Signup - Step 1: Enter details */}
          {method === "otp" && !otpSent && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  icon={<User size={20} />}
                />
                <Input
                  type="text"
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
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
                Send Verification Code
              </Button>
            </form>
          )}

          {/* OTP Signup - Step 2: Verify OTP */}
          {method === "otp" && otpSent && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Enter the 6-digit code sent to <strong className="font-semibold">{email}</strong>
              </p>
              <Input
                type="text"
                label="Verification Code"
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
                Verify & Create Account
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

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-pink-500 hover:text-pink-600"
            >
              Sign in
            </Link>
          </p>

          {/* Terms */}
          <p className="mt-4 text-xs text-center text-gray-500">
            By signing up, you agree to our{" "}
            <a href="#" className="underline hover:text-gray-700">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-gray-700">
              Privacy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
