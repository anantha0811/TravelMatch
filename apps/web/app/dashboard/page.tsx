"use client";

import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { logout as apiLogout } from "@/lib/api/auth";
import toast from "react-hot-toast";
import { User, Mail, Phone, CheckCircle, XCircle, LogOut } from "lucide-react";

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await apiLogout(refreshToken);
      }
      logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      logout();
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar - Tinder/Bumble Style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">✈️</span>
              </div>
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                TravelTinder
              </h1>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              icon={<LogOut size={18} />}
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-4xl font-display font-bold text-gray-900">
                Hey, {user?.firstName || "Traveler"}! 👋
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                Ready to find your next travel companion?
              </p>
            </div>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            {user?.email && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Mail className="text-pink-500" size={24} />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    Email
                  </p>
                  <p className="font-semibold text-gray-900">
                    {user.email}
                  </p>
                </div>
                {user.isEmailVerified ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-gray-400" size={20} />
                )}
              </div>
            )}

            {/* Mobile */}
            {user?.mobile && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Phone className="text-pink-500" size={24} />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    Mobile
                  </p>
                  <p className="font-semibold text-gray-900">
                    {user.mobile}
                  </p>
                </div>
                {user.isMobileVerified ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-gray-400" size={20} />
                )}
              </div>
            )}

            {/* Name */}
            {user?.firstName && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <User className="text-pink-500" size={24} />
                <div>
                  <p className="text-sm text-gray-500">
                    Name
                  </p>
                  <p className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName || ""}
                  </p>
                </div>
              </div>
            )}

            {/* Profile Completion */}
            {user?.profileCompletionPercentage !== undefined && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    Profile Completion
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${user.profileCompletionPercentage}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {user.profileCompletionPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-pink-200 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4">
              <User className="text-pink-500" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Complete Profile
            </h3>
            <p className="text-gray-600 text-sm">
              Add photos, bio, and travel preferences
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-pink-200 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start Swiping
            </h3>
            <p className="text-gray-600 text-sm">
              Discover travelers heading to your destinations
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-pink-200 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              View Matches
            </h3>
            <p className="text-gray-600 text-sm">
              Chat with your travel matches
            </p>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-lg p-12 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold mb-2 text-white">More Features Coming Soon!</h2>
          <p className="text-lg text-pink-50">
            Profile creation, trip matching, chat, and more exciting features
          </p>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
