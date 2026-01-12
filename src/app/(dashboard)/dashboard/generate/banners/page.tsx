"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { steps } from "@/lib/generateConstants";
import { BannerLoading, BannerGrid } from "@/components/Banner";
import PlanCard from "@/components/PlanCard";

interface Banner {
  id: number;
  image?: string | null;
  label?: string;
  error?: string;
}

export default function BannersPage() {
  const currentStep = 3; // Currently on step 3 (Banners)
  const [isLoading, setIsLoading] = useState(false); // Set to false to show results, true for loading state
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBanners, setSelectedBanners] = useState<number[]>([]);
  const [banners, setBanners] = useState<Banner[]>([
    { id: 0, label: "Banner Image 1" },
    { id: 1, label: "Banner Image 2" },
    { id: 2, label: "Banner Image 3" },
  ]);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const planData = {
    plan: "Pro",
    adsThisMonth: 12,
    limit: 200,
  };

  // Generate banners on mount
  useEffect(() => {
    const generateBanners = async () => {
      try {
        // Get extracted data from localStorage
        const storedData = localStorage.getItem('extractedData');
        if (!storedData) {
          setGenerationError('No brand data found. Please go back and extract data first.');
          return;
        }

        const extractedData = JSON.parse(storedData);
        setIsGenerating(true);
        setGenerationError(null);

        // Get brand assets if available
        const brandAssetsData = localStorage.getItem('brandAssets');
        const brandAssets = brandAssetsData ? JSON.parse(brandAssetsData) : {};

        // Call backend API to generate banners
        const response = await fetch('http://localhost:5000/api/generate/banners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            extractedData,
            brandAssets,
            count: 3,
          }),
        });

        const data = await response.json();

        if (data.success && data.banners) {
          setBanners(data.banners);
          console.log(`Generated ${data.generated} banners successfully`);
        } else {
          setGenerationError(data.error || 'Failed to generate banners');
        }
      } catch (error) {
        console.error('Banner generation error:', error);
        setGenerationError('Failed to connect to server. Make sure the backend is running.');
      } finally {
        setIsGenerating(false);
      }
    };

    generateBanners();
  }, []);

  // Initialize selected banners count in localStorage on mount
  useEffect(() => {
    const savedCount = localStorage.getItem('selectedBannersCount');
    if (!savedCount) {
      localStorage.setItem('selectedBannersCount', '0');
    }
  }, []);

  const toggleBannerSelection = (index: number) => {
    setSelectedBanners((prev) => {
      const newSelection = prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index];

      // Save the count to localStorage so strategy page can reflect it
      localStorage.setItem('selectedBannersCount', newSelection.length.toString());

      return newSelection;
    });
  };


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

        {/* Banners Section */}
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
          <h1 className="mb-2 sm:mb-3 text-xl sm:text-2xl font-bold text-white text-center">
            Professional Ad Banners
          </h1>

          {/* Descriptive Text */}
          <p className="text-zinc-400 text-sm text-center">
            {isLoading
              ? "Creating banners with 4 photos (from site)..."
              : "AI is generating banners using your brand assets."}
          </p>

          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-white">
              <span className="text-zinc-400">Using:</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#25214a] bg-[#141129] px-3 py-1 text-xs font-semibold text-[#b4a5ff] shadow-sm shadow-purple-800/30">
                <svg
                  className="h-4 w-4 text-[#b4a5ff]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h2l1-2h6l1 2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                <span className="text-white">4 Photos</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-white">
              <span className="text-zinc-400">Colors:</span>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-[#d7be70]" />
                <span className="h-4 w-4 rounded-full bg-[#2f46c3]" />
                <span className="h-4 w-4 rounded-full bg-[#e9ce76]" />
              </div>
            </div>
          </div>
        </section>

        {isLoading ? (
          <BannerLoading />
        ) : (
          <>
            {generationError && (
              <div className="max-w-7xl mx-auto px-8 mb-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                  <p className="text-red-400 text-sm">{generationError}</p>
                </div>
              </div>
            )}
            <BannerGrid
              selectedBanners={selectedBanners}
              onBannerToggle={toggleBannerSelection}
              banners={banners}
              isGenerating={isGenerating}
            />
          </>
        )}
      </main>
    </div>
  );
}
