"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSidebar } from "@/components/Sidebar/SidebarContext";
import { api } from "@/lib/api";
import UpgradePlanModal from "@/components/UpgradePlanModal";

// Plan display names and token limits
const PLAN_INFO: Record<string, { name: string; tokens: number }> = {
  starter: { name: "Starter Pack", tokens: 5 },
  creator: { name: "Creator", tokens: 20 },
  business: { name: "Business", tokens: 50 },
  agency: { name: "Agency", tokens: -1 }, // -1 means unlimited
};

interface UsageData {
  currentPlan: string;
  planDisplayName: string;
  adsGeneratedThisMonth: number;
  monthlyLimit: number;
  remainingThisMonth: number;
  periodStart: string | null;
  periodEnd: string | null;
  isUnlimited: boolean;
}

export default function UsagePage() {
  const { open } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usageData, setUsageData] = useState<UsageData>({
    currentPlan: "starter",
    planDisplayName: "Starter Pack",
    adsGeneratedThisMonth: 0,
    monthlyLimit: 5,
    remainingThisMonth: 5,
    periodStart: null,
    periodEnd: null,
    isUnlimited: false,
  });

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        setLoading(true);
        const response = await api.getUsage();
        
        if (response.success && response.data) {
          const { plan, adsRemaining, adsUsedThisMonth, monthlyLimit, billingPeriodStart, billingPeriodEnd } = response.data;
          const planInfo = PLAN_INFO[plan] || PLAN_INFO.starter;
          const isUnlimited = monthlyLimit === -1;
          
          setUsageData({
            currentPlan: plan,
            planDisplayName: planInfo.name,
            adsGeneratedThisMonth: adsUsedThisMonth,
            monthlyLimit: isUnlimited ? 0 : monthlyLimit,
            remainingThisMonth: isUnlimited ? -1 : adsRemaining,
            periodStart: billingPeriodStart ? new Date(billingPeriodStart).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : null,
            periodEnd: billingPeriodEnd ? new Date(billingPeriodEnd).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : null,
            isUnlimited,
          });
        } else {
          setError(response.message || "Failed to load usage data");
        }
      } catch (err) {
        console.error("Error fetching usage data:", err);
        setError("Failed to load usage data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
  }, []);

  const availablePercentage =
    usageData.isUnlimited
      ? 100
      : usageData.monthlyLimit > 0
      ? Math.round(
          ((usageData.monthlyLimit - usageData.adsGeneratedThisMonth) /
            usageData.monthlyLimit) *
            100
        )
      : 0;

  const progressPercentage =
    usageData.isUnlimited
      ? 0
      : usageData.monthlyLimit > 0
      ? (usageData.adsGeneratedThisMonth / usageData.monthlyLimit) * 100
      : 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <header className="flex h-[73px] items-center border-b border-[#1a1a22] px-8">
          <h1 className="text-lg font-semibold text-white">Ad Generator</h1>
        </header>
        <main className="px-12 py-8 lg:px-16">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <header className="flex h-[73px] items-center border-b border-[#1a1a22] px-8">
          <h1 className="text-lg font-semibold text-white">Ad Generator</h1>
        </header>
        <main className="px-12 py-8 lg:px-16">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400 hover:bg-red-500/30"
            >
              Try Again
            </button>
          </div>
        </main>
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
        <h2 className="mb-8 text-2xl font-bold text-white">
          Usage & Analytics
        </h2>

        {/* Current Plan Card */}
        <div className="mb-6 rounded-xl border border-[#1a1a22] bg-[#0d1117] p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-[#6a4cff]"
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
                Current Plan
              </span>
            </div>
            <span className="rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-3 py-1 text-sm font-medium text-white">
              {usageData.planDisplayName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ads Generated This Month */}
            <div>
              <p className="mb-2 text-sm text-zinc-400">
                Ads Generated This Month
              </p>
              <div className="mb-3">
                <span className="text-3xl font-bold text-white">
                  {usageData.adsGeneratedThisMonth}
                </span>
                {!usageData.isUnlimited && (
                  <span className="text-xl text-zinc-500">
                    {" "}
                    / {usageData.monthlyLimit}
                  </span>
                )}
                {usageData.isUnlimited && (
                  <span className="text-xl text-zinc-500"> / Unlimited</span>
                )}
              </div>
              {/* Progress Bar */}
              {!usageData.isUnlimited && (
                <div className="h-2 w-full rounded-full bg-[#1a1a22]">
                  <div
                    className="h-2 rounded-full bg-[#6a4cff]"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              )}
              {usageData.isUnlimited && (
                <div className="h-2 w-full rounded-full bg-[#6a4cff]" />
              )}
            </div>

            {/* Remaining This Month */}
            <div>
              <p className="mb-2 text-sm text-zinc-400">Remaining This Month</p>
              <p className="text-3xl font-bold text-white mb-4">
                {usageData.isUnlimited ? "Unlimited" : usageData.remainingThisMonth}
              </p>
              {!usageData.isUnlimited && (
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  Upgrade Plan
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Billing Period Card */}
        <div className="mb-6 rounded-xl border border-[#1a1a22] bg-[#0d1117] p-6">
          <div className="flex items-center gap-2 mb-6">
            <svg
              className="h-5 w-5 text-[#6a4cff]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-lg font-semibold text-white">
              Billing Period
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="mb-1 text-sm text-zinc-400">Period Start</p>
              <p className="text-lg font-semibold text-white">
                {usageData.periodStart || "N/A"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-zinc-400">Period End</p>
              <p className="text-lg font-semibold text-white">
                {usageData.periodEnd || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Usage Overview Card */}
        <div className="mb-6 rounded-xl border border-[#1a1a22] bg-[#0d1117] p-6">
          <div className="flex items-center gap-2 mb-6">
            <svg
              className="h-5 w-5 text-[#6a4cff]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-lg font-semibold text-white">
              Usage Overview
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ads This Month */}
            <div className="rounded-lg bg-[#12121a] p-6 text-center">
              <p className="text-4xl font-bold text-[#6a4cff] mb-2">
                {usageData.adsGeneratedThisMonth}
              </p>
              <p className="text-sm text-zinc-400">Ads This Month</p>
            </div>

            {/* Monthly Limit */}
            <div className="rounded-lg bg-[#12121a] p-6 text-center">
              <p className="text-4xl font-bold text-white mb-2">
                {usageData.isUnlimited ? "∞" : usageData.monthlyLimit}
              </p>
              <p className="text-sm text-zinc-400">Monthly Limit</p>
            </div>

            {/* Available */}
            <div className="rounded-lg bg-[#12121a] p-6 text-center">
              <p className="text-4xl font-bold text-white mb-2">
                {usageData.isUnlimited ? "∞" : `${availablePercentage}%`}
              </p>
              <p className="text-sm text-zinc-400">Available</p>
            </div>
          </div>
        </div>

        

        {/* Need More Ads CTA - Only show if not on unlimited plan */}
        {!usageData.isUnlimited && (
          <div className="rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ec4899] p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Need more ads?
                </h3>
                <p className="text-sm text-white/70">
                  Upgrade your plan for unlimited ad generation.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center rounded-lg bg-[#431A56] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#5a2569]"
              >
                View Plans
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentPlan={usageData.currentPlan}
      />
    </div>
  );
}

