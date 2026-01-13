"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { steps } from "@/lib/generateConstants";
import PlanCard from "@/components/PlanCard";

interface Banner {
  id: number;
  image?: string | null;
  label?: string;
  error?: string;
  size?: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const currentStep = 4; // Step 4 (Results)
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedBanners, setSelectedBanners] = useState<number[]>([]);

  const planData = {
    plan: "Pro",
    adsThisMonth: 12,
    limit: 200,
  };

  // Load banners from localStorage on mount
  useEffect(() => {
    const storedBanners = localStorage.getItem('generatedBanners');
    if (storedBanners) {
      const parsedBanners = JSON.parse(storedBanners);
      setBanners(parsedBanners.filter((b: Banner) => b.image));
    }

    const storedSelected = localStorage.getItem('selectedBannerIds');
    if (storedSelected) {
      setSelectedBanners(JSON.parse(storedSelected));
    }
  }, []);

  const successfulBanners = banners.filter(b => b.image);
  const bannerCount = successfulBanners.length || parseInt(localStorage.getItem('requestedAdsCount') || '3', 10);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <header className="flex h-[73px] items-center border-b border-[#141533] px-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-white hover:text-zinc-400 transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Overview
        </Link>
      </header>

      <main className="relative flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-16 lg:py-12">
        <PlanCard
          plan={planData.plan}
          adsThisMonth={planData.adsThisMonth}
          limit={planData.limit}
        />

        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-0 mb-8 sm:mb-12 lg:mb-16 mt-8 sm:mt-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all ${step.number <= currentStep
                    ? "bg-gradient-to-r from-[#6666FF] to-[#FF66FF] text-white"
                    : "border border-[#141533] bg-[#0d1117] text-zinc-400"
                    }`}
                >
                  {step.number}
                </div>
                <span
                  className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium hidden sm:block ${step.number <= currentStep
                    ? "text-white"
                    : "text-zinc-500"
                    }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-[2px] w-6 sm:w-12 lg:w-16 mx-1 sm:mx-2 sm:mt-[-20px] ${step.number < currentStep
                    ? "bg-gradient-to-r from-[#6666FF] to-[#FF66FF]"
                    : "bg-[#1a1a22]"
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Results Section */}
        <section className="flex flex-col items-center px-2 sm:px-0">
          {/* Icon */}
          <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#6666FF] to-[#FF66FF] shadow-lg shadow-purple-500/40">
            <svg
              className="h-6 w-6 sm:h-7 sm:w-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="mb-2 sm:mb-3 text-2xl sm:text-3xl font-bold text-white text-center">
            Your Ads Are Ready!
          </h1>

          {/* Descriptive Text */}
          <p className="text-zinc-400 text-sm sm:text-base text-center mb-8">
            {bannerCount} high-converting ad variations.
          </p>

          {/* Edit Copy Button */}
          <button
            className="flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-[#0d1117] px-5 py-2.5 text-white text-sm font-medium transition-all hover:border-zinc-600 hover:bg-[#12121a]"
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Copy
          </button>
        </section>

        {/* Banner Preview Grid */}
        {successfulBanners.length > 0 && (
          <div className="max-w-7xl mx-auto mt-12 px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {successfulBanners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="relative aspect-square rounded-xl overflow-hidden border border-[#141533] bg-[#0d1117] group"
                >
                  {banner.image && (
                    <img
                      src={banner.image}
                      alt={banner.label || `Banner ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-colors">
                      Download
                    </button>
                  </div>
                  {banner.label && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="inline-block px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-white text-xs">
                        {banner.label}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="w-full max-w-7xl mx-auto px-8 mt-12 pb-12 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-[#0d1117] px-6 py-3 text-white transition-all hover:border-zinc-600 hover:bg-[#12121a]"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back</span>
          </button>

          {/* Finish Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-6 py-3 text-white font-medium transition-all hover:from-[#9333ea] hover:to-[#db2777] shadow-lg shadow-purple-500/20"
          >
            <span>Finish & Go to Dashboard</span>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
