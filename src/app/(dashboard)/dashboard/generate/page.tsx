"use client";

import { useState } from "react";
import Link from "next/link";

const steps = [
  { number: 1, label: "URL" },
  { number: 2, label: "Strategy" },
  { number: 3, label: "Banners" },
  { number: 4, label: "Results" },
];

export default function GeneratePage() {
  const [currentStep] = useState(1);
  const [url, setUrl] = useState("");

  // Mock data - would come from API/auth state
  const planData = {
    plan: "Agency",
    adsThisMonth: 0,
    limit: Infinity,
  };

  const handleAnalyze = () => {
    if (!url) return;
    // TODO: Implement URL analysis logic
    console.log("Analyzing:", url);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="flex h-[73px] items-center border-b border-[#1a1a22] px-8">
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

      {/* Main Content */}
      <main className="relative px-4 py-6 sm:px-8 sm:py-8 lg:px-16 lg:py-12">
        {/* Plan Card - Centered on mobile, absolute on larger screens */}
        <div className="mb-6 flex justify-center lg:justify-end lg:absolute lg:top-8 lg:right-16 lg:mb-0">
          <div className="rounded-lg border border-[#1a1a22] bg-[#0d1117] px-4 py-3 w-full max-w-xs sm:w-auto">
            <div className="flex items-center justify-between gap-6 mb-1">
              <div className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 text-purple-400"
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
                <span className="text-sm font-medium text-white">Plan</span>
              </div>
              <span className="rounded-full bg-[#22d3ee] px-3 py-0.5 text-xs font-semibold text-black">
                {planData.plan}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Ads this month</span>
              <span className="text-white">
                {planData.adsThisMonth} / {planData.limit === Infinity ? "∞" : planData.limit}
              </span>
            </div>
            <p className="text-xs text-[#22d3ee] mt-1">Unlimited ad generation</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-8 sm:mb-12 lg:mb-16">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    step.number === currentStep
                      ? "bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white"
                      : step.number < currentStep
                      ? "bg-[#22d3ee] text-black"
                      : "border border-[#1a1a22] bg-[#0d1117] text-zinc-400"
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium hidden sm:block ${
                    step.number === currentStep
                      ? "text-white"
                      : "text-zinc-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-[2px] w-6 sm:w-12 lg:w-16 mx-1 sm:mx-2 sm:mt-[-20px] ${
                    step.number < currentStep
                      ? "bg-[#22d3ee]"
                      : "bg-[#1a1a22]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* URL Input Section */}
        <div className="flex flex-col items-center px-2 sm:px-0">
          {/* Globe Icon */}
          <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#5850ff] to-[#ec4899] shadow-lg shadow-purple-500/40">
            <svg
              className="h-6 w-6 sm:h-7 sm:w-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="mb-2 sm:mb-3 text-xl sm:text-2xl font-bold text-white text-center">
            Enter Your Product URL
          </h1>

          {/* Subtitle */}
          <p className="mb-6 sm:mb-8 text-center text-sm sm:text-base text-zinc-400 max-w-md px-4">
            Paste the link to your landing page or product and our AI will analyze it.
          </p>

          {/* URL Input Card */}
          <div className="w-full max-w-2xl rounded-xl border border-[#1a1a22] bg-[#0d1117] p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourproduct.com"
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none rounded-lg sm:rounded-none border border-[#1a1a22] sm:border-0"
              />
              <button
                onClick={handleAnalyze}
                disabled={!url}
                className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                Analyze Site
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Helper Text */}
          <p className="mt-4 sm:mt-6 text-[10px] sm:text-xs text-zinc-500 text-center px-4">
            Works with any product page, landing page, or ecommerce site.
          </p>
        </div>
      </main>
    </div>
  );
}

