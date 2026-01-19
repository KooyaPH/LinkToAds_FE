"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { steps } from "@/lib/generateConstants";
import { BannerLoading, BannerGrid } from "@/components/Banner";
import PlanCard from "@/components/PlanCard";
import { saveBanners, loadBanners, updateBanner as updateBannerStorage, clearBanners } from "@/lib/bannerStorage";
import { api } from "@/lib/api";

// Plan display names
const PLAN_INFO: Record<string, { name: string }> = {
  starter: { name: "Starter Pack" },
  creator: { name: "Creator" },
  business: { name: "Business" },
  agency: { name: "Agency" },
};

interface Banner {
  id: number;
  image?: string | null;
  label?: string;
  error?: string;
  size?: string;
}

export default function BannersPage() {
  const router = useRouter();
  const currentStep = 3; // Currently on step 3 (Banners)
  const [isLoading, setIsLoading] = useState(false); // Set to false to show results, true for loading state
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBanners, setSelectedBanners] = useState<number[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [brandColors, setBrandColors] = useState<string[]>(["#d7be70", "#2f46c3", "#e9ce76"]); // Default colors
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [planData, setPlanData] = useState<{
    plan: string;
    adsThisMonth: number;
    limit: number;
  }>({
    plan: "Starter Pack",
    adsThisMonth: 0,
    limit: 5,
  });

  // Generate banners on mount (or load from cache if already generated)
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

        // Set brand colors if available
        if (extractedData.aiInsights?.brandColorPalette && Array.isArray(extractedData.aiInsights.brandColorPalette)) {
          setBrandColors(extractedData.aiInsights.brandColorPalette);
        }

        // Check if banners were already generated (e.g., coming back from results page)
        const cachedBanners = await loadBanners();
        if (cachedBanners && cachedBanners.length > 0) {
          setBanners(cachedBanners);
          // Also restore selected banners
          const cachedSelected = localStorage.getItem('selectedBannerIds');
          if (cachedSelected) {
            setSelectedBanners(JSON.parse(cachedSelected));
          }
          console.log('Loaded cached banners from storage');
          return; // Skip regeneration
        }

        setIsGenerating(true);
        setGenerationError(null);

        // Get brand assets if available
        const brandAssetsData = localStorage.getItem('brandAssets');
        const brandAssets = brandAssetsData ? JSON.parse(brandAssetsData) : {};

        // Get requested ad count and other strategy selections from localStorage
        const requestedCount = localStorage.getItem('requestedAdsCount');
        const count = requestedCount ? parseInt(requestedCount, 10) : 3;

        const storedSizes = localStorage.getItem('selectedBannerSizes');
        const selectedBannerSizes = storedSizes ? JSON.parse(storedSizes) : ['square'];

        const storedArchetypes = localStorage.getItem('selectedArchetypes');
        const selectedArchetypes = storedArchetypes ? JSON.parse(storedArchetypes) : [];

        // Initialize placeholders based on count
        setBanners(Array.from({ length: count }, (_, i) => ({ id: i, label: `Banner Image ${i + 1}` })));

        // Call backend API to generate banners
        const response = await fetch('http://localhost:5000/api/generate/banners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            extractedData,
            brandAssets,
            count,
            selectedBannerSizes,
            selectedArchetypes,
          }),
        });

        const data = await response.json();

        if (data.success && data.banners) {
          setBanners(data.banners);
          // Save banners to storage (IndexedDB for images, localStorage for metadata)
          await saveBanners(data.banners);
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

  // Fetch plan data on mount
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const usageResponse = await api.getUsage();
        if (usageResponse.success && usageResponse.data) {
          const { plan, adsUsedThisMonth, monthlyLimit } = usageResponse.data;
          const planInfo = PLAN_INFO[plan] || PLAN_INFO.starter;
          
          setPlanData({
            plan: planInfo.name,
            adsThisMonth: adsUsedThisMonth || 0,
            limit: monthlyLimit === -1 ? Infinity : monthlyLimit,
          });
        }
      } catch (err) {
        console.error("Failed to fetch plan data:", err);
      }
    };

    fetchPlanData();
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

  const handleBannerUpdate = async (bannerId: number, updatedBanner: Banner) => {
    setBanners((prevBanners) => {
      const updated = prevBanners.map((banner) =>
        banner.id === bannerId ? updatedBanner : banner
      );
      // Update storage with regenerated banner
      saveBanners(updated).catch(console.error);
      return updated;
    });
  };

  const handleSaveAndContinue = async () => {
    // Save generated banners to storage for the results page
    await saveBanners(banners);
    localStorage.setItem('selectedBannerIds', JSON.stringify(selectedBanners));
    
    // Navigate to results page
    router.push('/dashboard/generate/results');
  };

  const handleRegenerateAll = async () => {
    // Clear cached banners
    await clearBanners();
    localStorage.removeItem('selectedBannerIds');
    setSelectedBanners([]);
    setGenerationError(null);

    // Regenerate banners
    try {
      const storedData = localStorage.getItem('extractedData');
      if (!storedData) {
        setGenerationError('No brand data found. Please go back and extract data first.');
        return;
      }

      const extractedData = JSON.parse(storedData);

      // Get brand assets if available
      const brandAssetsData = localStorage.getItem('brandAssets');
      const brandAssets = brandAssetsData ? JSON.parse(brandAssetsData) : {};

      // Get requested ad count and other strategy selections from localStorage
      const requestedCount = localStorage.getItem('requestedAdsCount');
      const count = requestedCount ? parseInt(requestedCount, 10) : 3;

      const storedSizes = localStorage.getItem('selectedBannerSizes');
      const selectedBannerSizes = storedSizes ? JSON.parse(storedSizes) : ['square'];

      const storedArchetypes = localStorage.getItem('selectedArchetypes');
      const selectedArchetypes = storedArchetypes ? JSON.parse(storedArchetypes) : [];

      // Initialize placeholders based on count
      setBanners(Array.from({ length: count }, (_, i) => ({ id: i, label: `Banner Image ${i + 1}` })));
      setIsGenerating(true);

      // Call backend API to generate banners
      const response = await fetch('http://localhost:5000/api/generate/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extractedData,
          brandAssets,
          count,
          selectedBannerSizes,
          selectedArchetypes,
        }),
      });

      const data = await response.json();

      if (data.success && data.banners) {
        setBanners(data.banners);
        // Save regenerated banners to storage
        await saveBanners(data.banners);
        console.log(`Regenerated ${data.generated} banners successfully`);
      } else {
        setGenerationError(data.error || 'Failed to regenerate banners');
      }
    } catch (error) {
      console.error('Banner regeneration error:', error);
      setGenerationError('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setIsGenerating(false);
    }
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
            {isGenerating
              ? `Creating ${banners.length} professional banners using AI...`
              : `AI has generated ${banners.length} banners using your brand assets.`}
          </p>

          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-white">
              <span className="text-zinc-400">Generating:</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#25214a] bg-[#141129] px-3 py-1 text-xs font-semibold text-[#b4a5ff] shadow-sm shadow-purple-800/30">
                <svg
                  className="h-4 w-4 text-[#b4a5ff]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
                <span className="text-white">{banners.length} Banners</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-white">
              <span className="text-zinc-400">Colors:</span>
              <div className="flex items-center gap-2">
                {brandColors.map((color, idx) => (
                  <span
                    key={idx}
                    className="h-4 w-4 rounded-full border border-white/10"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
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
            
            {/* Banner Group Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
              <div className="rounded-2xl border border-[#141533] bg-[#0d1117] p-4 sm:p-6 lg:p-8">
                <BannerGrid
                  selectedBanners={selectedBanners}
                  onBannerToggle={toggleBannerSelection}
                  banners={banners}
                  isGenerating={isGenerating}
                  onBannerUpdate={handleBannerUpdate}
                />
                
                {/* Footer with Status and Regenerate Button */}
                <div className="mt-6 pt-6 border-t border-[#141533] flex items-center justify-between">
                  <div className="text-sm text-zinc-400">
                    {selectedBanners.length} {selectedBanners.length === 1 ? 'banner' : 'banners'} selected
                  </div>
                  <button
                    onClick={handleRegenerateAll}
                    disabled={isGenerating}
                    className="flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-[#0a0a12] px-4 py-2 text-sm text-white transition-all hover:border-zinc-600 hover:bg-[#12121a] disabled:opacity-50 disabled:cursor-not-allowed"
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Regenerate All
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {/* Navigation Buttons */}
        <div className="w-full max-w-7xl mx-auto px-8 mt-8 pb-12 flex items-center justify-between">
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

          {/* Save & Continue Button */}
          <button
            onClick={handleSaveAndContinue}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-6 py-3 text-white font-medium transition-all hover:from-[#9333ea] hover:to-[#db2777] shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Save & Continue</span>
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

      </main>
    </div>
  );
}
