"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { HeroCarousel } from "@/components/HeroCarousel";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar - Tinder/Bumble Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">✈️</span>
              </div>
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                TravelTinder
              </h1>
            </div>
            <div className="flex gap-2">
              {user ? (
                <Link href="/dashboard">
                  <Button size="sm">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-pink-50/50 via-rose-50/30 to-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          {/* Main Heading */}
          <h2 className="text-6xl md:text-8xl font-display font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            Find Your Perfect
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
              Travel Match
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto font-light">
            Swipe. Match. Explore the world together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/signup">
              <Button size="lg" className="min-w-[200px] w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="min-w-[200px] w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Animated Carousel */}
        <HeroCarousel />

        {/* Features - Simple Text */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 pb-20 px-4 text-center max-w-5xl mx-auto">
          <div>
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
              Discover
            </h3>
            <p className="text-gray-600">
              Browse travelers heading to your dream destinations
            </p>
          </div>

          <div>
            <div className="text-5xl mb-4">❤️</div>
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
              Match
            </h3>
            <p className="text-gray-600">
              Swipe right to connect with like-minded adventurers
            </p>
          </div>

          <div>
            <div className="text-5xl mb-4">✈️</div>
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
              Travel
            </h3>
            <p className="text-gray-600">
              Plan trips and create memories together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
