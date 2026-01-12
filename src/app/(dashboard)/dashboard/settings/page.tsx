"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/Sidebar/SidebarContext";
import { api } from "@/lib/api";
import { signOutSupabase } from "@/lib/supabase";

export default function SettingsPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [userData, setUserData] = useState({
    email: "",
    accountId: "",
    name: "",
    plan: "Free",
    monthlyUsage: 0,
    monthlyLimit: 10,
    remainingAds: "10 ads",
  });

  useEffect(() => {
    // Load user data from localStorage or API
    const loadUserData = async () => {
      const user = api.getUser();
      
      if (user) {
        setUserData((prev) => ({
          ...prev,
          email: user.email,
          accountId: user.id,
          name: user.name,
        }));
      } else {
        // If no user in localStorage, try fetching from API
        const response = await api.getCurrentUser();
        if (response.success && response.data?.user) {
          setUserData((prev) => ({
            ...prev,
            email: response.data!.user.email,
            accountId: response.data!.user.id,
            name: response.data!.user.name,
          }));
        } else {
          // Not authenticated, redirect to login
          router.push("/login");
        }
      }
      setIsLoading(false);
    };

    loadUserData();
  }, [router]);

  const handleSignOut = async () => {
    // Sign out from both Supabase and local storage
    await signOutSupabase();
    api.logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="flex h-[73px] items-center border-b border-[#1a1a22] px-8">
        <button
          onClick={open}
          className="lg:hidden mr-4 text-white hover:text-zinc-400 transition-colors"
          aria-label="Open sidebar"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-white">Ad Generator</h1>
      </header>

      {/* Main Content */}
      <main className="px-12 py-8 lg:px-16">
        {/* Page Title */}
        <h2 className="mb-8 text-2xl font-bold bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
          Settings
        </h2>

        {/* Account Settings Card */}
        <div className="mb-6 rounded-xl border border-[#1a1a22] bg-[#0d1117] p-6">
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-lg font-semibold text-white">
              Account Settings
            </span>
          </div>
          <p className="text-sm text-zinc-400 mb-6">
            Manage your account information
          </p>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              value={userData.email}
              readOnly
              className="w-full rounded-lg border border-[#1a1a22] bg-[#0a0a0f] px-4 py-3 text-zinc-400 text-sm cursor-not-allowed"
            />
            <p className="mt-2 text-xs text-zinc-500">
              Email cannot be changed.
            </p>
          </div>

          {/* Account ID Field */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Account ID
            </label>
            <input
              type="text"
              value={userData.accountId}
              readOnly
              className="w-full rounded-lg border border-[#1a1a22] bg-[#0a0a0f] px-4 py-3 text-zinc-400 text-sm cursor-not-allowed font-mono"
            />
          </div>
        </div>

        {/* Subscription Card */}
        <div className="mb-6 rounded-xl border border-[#1a1a22] bg-[#0d1117] p-6">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <span className="text-lg font-semibold text-white">
                Subscription
              </span>
            </div>
            <span className="rounded-full bg-[#1a1a22] px-3 py-1 text-sm font-medium text-white">
              {userData.plan}
            </span>
          </div>
          <p className="text-sm text-zinc-400 mb-6">
            Manage your plan and usage
          </p>

          {/* Monthly Usage */}
          <div className="flex items-center justify-between py-3 border-b border-[#1a1a22]">
            <span className="text-sm font-medium text-white">Monthly Usage</span>
            <span className="text-sm text-zinc-400">
              {userData.monthlyUsage} / {userData.monthlyLimit === Infinity ? "∞" : userData.monthlyLimit} ads
            </span>
          </div>

          {/* Remaining This Month */}
          <div className="py-4">
            <p className="text-sm font-medium text-white mb-1">
              Remaining This Month
            </p>
            <p className="text-sm text-zinc-400">{userData.remainingAds}</p>
          </div>

          {/* View Detailed Usage Button */}
          <Link
            href="/dashboard/usage"
            className="flex items-center justify-center gap-2 w-full rounded-lg border border-[#1a1a22] bg-[#0a0a0f] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#12121a]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            View Detailed Usage
          </Link>
        </div>

        {/* Danger Zone Card */}
        <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] p-6">
          <h3 className="text-lg font-semibold text-red-500 mb-1">
            Danger Zone
          </h3>
          <p className="text-sm text-zinc-400 mb-6">
            Irreversible account actions
          </p>

          <button
            onClick={handleSignOut}
            className="rounded-lg bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}

