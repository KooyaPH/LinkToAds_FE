"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { steps } from "@/lib/generateConstants";
import PlanCard from "@/components/PlanCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ExtractedImage {
  src: string;
  alt: string;
  type: string;
}

interface ExtractedHeading {
  tag: string;
  text: string;
}

interface ExtractedData {
  url: string;
  title: string;
  description: string;
  headings: ExtractedHeading[];
  paragraphs: string[];
  images: ExtractedImage[];
  logo: string | null;
  favicon: string | null;
  ctas: string[];
  keywords: string[];
  productInfo: {
    productName: string;
    industry: string;
    tagline: string;
  };
  pricing: {
    currentPrice: string;
    originalPrice: string;
    discount: string;
    couponCode: string;
    activeOffer: string;
    urgencyText: string;
  };
  socialProof: {
    rating: string;
    reviewCount: string;
    customers: string;
  };
  keyFeatures: string[];
  testimonials: string[];
  trustSignals: string[];
  aiInsights?: {
    uniqueSellingProposition?: string;
    targetAudience?: string;
    currentOffer?: string;
    brandToneAndVoice?: string;
    brandColorPalette?: string[];
  };
  extractedAt: string;
}

const progressSteps = [
  "Scraping site content...",
  "Extracting key information...",
  "Analyzing brand & offers...",
  "Generating AI insights...",
];

export default function GeneratePage() {
  const router = useRouter();
  const [currentStep] = useState(1);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressStep, setProgressStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  // Mock data - would come from API/auth state
  const planData = {
    plan: "Agency",
    adsThisMonth: 0,
    limit: Infinity,
  };

  const handleAnalyze = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setError("");
    setProgressStep(0);
    setProgressPercent(0);
    
    // Simulate progress steps sequentially
    const simulateProgress = (): Promise<void> => {
      return new Promise((resolve) => {
        let currentPercent = 0;
        
        // Step 1: Scraping site content (0-25%)
        setProgressStep(0);
        const interval1 = setInterval(() => {
          currentPercent += 2;
          if (currentPercent >= 25) {
            clearInterval(interval1);
            currentPercent = 25;
            setProgressPercent(25);
            
            // Small delay to show step 1 as completed before moving to step 2
            setTimeout(() => {
              // Step 2: Extracting key information (25-50%)
              setProgressStep(1);
              const interval2 = setInterval(() => {
                currentPercent += 2;
                if (currentPercent >= 50) {
                  clearInterval(interval2);
                  currentPercent = 50;
                  setProgressPercent(50);
                  
                  // Small delay to show step 2 as completed before moving to step 3
                  setTimeout(() => {
                    // Step 3: Analyzing brand & offers (50-75%)
                    setProgressStep(2);
                    const interval3 = setInterval(() => {
                      currentPercent += 2;
                      if (currentPercent >= 75) {
                        clearInterval(interval3);
                        currentPercent = 75;
                        setProgressPercent(75);
                        
                        // Small delay to show step 3 as completed before moving to step 4
                        setTimeout(() => {
                          // Step 4: Generating AI insights (75-100%)
                          setProgressStep(3);
                          const interval4 = setInterval(() => {
                            currentPercent += 2;
                            if (currentPercent >= 100) {
                              clearInterval(interval4);
                              setProgressPercent(100);
                              // Small delay to show step 4 as completed before resolving
                              setTimeout(() => {
                                resolve();
                              }, 300);
                            } else {
                              setProgressPercent(currentPercent);
                            }
                          }, 50);
                        }, 300);
                      } else {
                        setProgressPercent(currentPercent);
                      }
                    }, 50);
                  }, 300);
                } else {
                  setProgressPercent(currentPercent);
                }
              }, 50);
            }, 300);
          } else {
            setProgressPercent(currentPercent);
          }
        }, 50);
      });
    };
    
    try {
      console.log("🔍 Starting extraction for:", url);
      
      // Start progress simulation and API call in parallel
      const progressPromise = simulateProgress();
      
      const response = await fetch(`${API_BASE_URL}/scrape/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      // Wait for progress to complete (or ensure it completes)
      await progressPromise;

      if (result.success) {
        const data: ExtractedData = result.data;
        
        console.log("✅ Extraction successful!");
        console.log("📄 Page Title:", data.title);
        console.log("📝 Description:", data.description);
        console.log("🏷️ Headings:", data.headings);
        console.log("📖 Paragraphs:", data.paragraphs);
        console.log("🖼️ Images found:", data.images.length);
        console.log("🖼️ Images:", data.images);
        console.log("🔗 Logo:", data.logo);
        console.log("⭐ Favicon:", data.favicon);
        console.log("🎯 CTAs:", data.ctas);
        console.log("🔑 Keywords:", data.keywords);
        console.log("🤖 AI Insights:", data.aiInsights);
        console.log("📊 Full extracted data:", data);
        
        // Store extracted data in localStorage for the strategy page
        localStorage.setItem('extractedData', JSON.stringify(data));
        
        // Ensure progress completes
        setProgressStep(3);
        setProgressPercent(100);
        
        // Wait a moment for UI to show completion, then navigate
        setTimeout(() => {
          router.push("/dashboard/generate/strategy");
        }, 500);
      } else {
        setError(result.message || "Failed to extract content");
        console.error("❌ Extraction failed:", result.message);
        setIsLoading(false);
        setProgressStep(0);
        setProgressPercent(0);
      }
    } catch (err) {
      const errorMessage = "Failed to connect to the server. Please make sure the backend is running.";
      setError(errorMessage);
      console.error("❌ Error:", err);
      setIsLoading(false);
      setProgressStep(0);
      setProgressPercent(0);
    }
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
        <PlanCard
          plan={planData.plan}
          adsThisMonth={planData.adsThisMonth}
          limit={planData.limit}
        />

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

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-2xl mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* URL Input Card */}
          <div className="w-full max-w-2xl rounded-xl border border-[#1a1a22] bg-[#0d1117] p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourproduct.com"
                disabled={isLoading}
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none rounded-lg sm:rounded-none border border-[#1a1a22] sm:border-0 disabled:opacity-50"
              />
              <button
                onClick={handleAnalyze}
                disabled={!url || isLoading}
                className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading Progress Section */}
          {isLoading && (
            <div className="w-full max-w-2xl mt-4 sm:mt-6 rounded-xl border border-[#1a1a22] bg-[#0d1117] p-4 sm:p-6">
              {/* Progress Bar */}
              <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#1a1a22]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Progress Steps */}
              <div className="space-y-3">
                {progressSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 text-sm transition-colors ${
                      index === progressStep
                        ? "text-white font-semibold"
                        : index < progressStep
                        ? "text-zinc-400"
                        : "text-zinc-500"
                    }`}
                  >
                    {index < progressStep ? (
                      <svg className="h-5 w-5 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : index === progressStep ? (
                      <svg className="h-5 w-5 flex-shrink-0 animate-spin text-[#a855f7]" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-zinc-500" />
                    )}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Helper Text */}
          <p className="mt-4 sm:mt-6 text-[10px] sm:text-xs text-zinc-500 text-center px-4">
            Works with any product page, landing page, or ecommerce site.
          </p>
        </div>
      </main>
    </div>
  );
}

