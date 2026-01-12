"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  steps, 
  adOptions, 
  bannerSizes, 
  archetypeCategories, 
  quickFilters,
  quickFilterSelections
} from "@/lib/generateConstants";

// Mock data - would come from API/auth state
const planData = {
  plan: "Pro",
  adsThisMonth: 3,
  limit: 200,
};

interface ExtractedData {
  url: string;
  title: string;
  description: string;
  headings: Array<{ tag: string; text: string }>;
  paragraphs: string[];
  images: Array<{ src: string; alt: string; type: string }>;
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
  testimonials: Array<{
    quote: string;
    author: string;
    title?: string;
  }>;
  trustSignals: string[];
  aiInsights: {
    uniqueSellingProposition: string;
    targetAudience: string;
    currentOffer: string;
    brandToneAndVoice: string;
  };
  extractedAt: string;
}

export default function StrategyPage() {
  const router = useRouter();
  const [currentStep] = useState(2);
  const [selectedAds, setSelectedAds] = useState<number>(5);
  const [selectedBannerSizes, setSelectedBannerSizes] = useState<string[]>(["square"]);
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>(["lofi", "5star", "lifestyle"]);
  const [selectedProductPhoto, setSelectedProductPhoto] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // AI-Extracted Insights state
  const [productInfo, setProductInfo] = useState({
    productName: "",
    industry: "",
    tagline: "",
  });
  
  const [pricing, setPricing] = useState({
    currentPrice: "",
    originalPrice: "",
    discount: "",
    couponCode: "",
    activeOffer: "",
    urgencyText: "",
  });
  
  const [socialProof, setSocialProof] = useState({
    rating: "",
    reviewCount: "",
    customers: "",
  });
  
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [testimonials, setTestimonials] = useState<Array<{
    quote: string;
    author: string;
    title?: string;
  }>>([]);
  const [trustSignals, setTrustSignals] = useState<string[]>([]);
  const [ctas, setCtas] = useState<string[]>([]);
  const [aiInsights, setAiInsights] = useState({
    uniqueSellingProposition: "",
    targetAudience: "",
    currentOffer: "",
    brandToneAndVoice: "",
  });
  const [extractedImages, setExtractedImages] = useState<Array<{ src: string; alt: string; type: string }>>([]);
  const [extractedLogo, setExtractedLogo] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Load extracted data from localStorage on mount
  useEffect(() => {
    const loadExtractedData = () => {
      try {
        const storedData = localStorage.getItem('extractedData');
        if (storedData) {
          const data: ExtractedData = JSON.parse(storedData);
          
          // Update all state with extracted data
          if (data.productInfo) {
            setProductInfo(data.productInfo);
          }
          if (data.pricing) {
            setPricing(data.pricing);
          }
          if (data.socialProof) {
            setSocialProof(data.socialProof);
          }
          if (data.keyFeatures) {
            setKeyFeatures(data.keyFeatures);
          }
          if (data.testimonials) {
            // Convert string testimonials to structured format if needed
            if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
              const structuredTestimonials = data.testimonials.map((t: string | { quote: string; author: string; title?: string }) => {
                if (typeof t === 'string') {
                  return { quote: t, author: '', title: '' };
                }
                return t;
              });
              setTestimonials(structuredTestimonials);
            }
          }
          if (data.trustSignals) {
            setTrustSignals(data.trustSignals);
          }
          if (data.ctas) {
            setCtas(data.ctas);
          }
          if (data.aiInsights) {
            setAiInsights(data.aiInsights);
          }
          if (data.images) {
            setExtractedImages(data.images);
          }
          if (data.logo) {
            setExtractedLogo(data.logo);
          }
          
          setIsLoading(false);
        } else {
          // No data found, redirect back to generate page
          console.warn("No extracted data found. Redirecting to generate page.");
          router.push("/dashboard/generate");
        }
      } catch (error) {
        console.error("Error loading extracted data:", error);
        setIsLoading(false);
        router.push("/dashboard/generate");
      }
    };

    loadExtractedData();
  }, [router]);

  // Show loading state while data is being loaded
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <svg className="h-8 w-8 animate-spin text-[#6a4cff] mx-auto mb-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-zinc-400">Loading extracted data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
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

      {/* Main Content */}
      <main className="relative px-4 py-6 sm:px-8 sm:py-8 lg:px-16 lg:py-12">
        {/* Plan Card */}
        <div className="mb-6 flex justify-center lg:justify-end lg:absolute lg:top-8 lg:right-16 lg:mb-0">
          <div className="rounded-lg border border-[#141533] bg-[#0d1117] px-4 py-3 w-full max-w-xs sm:w-auto">
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
              <span className="rounded-full bg-[#1a1a22] px-3 py-0.5 text-xs font-semibold text-white flex items-center gap-1">
                {planData.plan}
                <span className="ml-1 rounded-full bg-[#4c1d95] px-2 py-0.5 text-[10px] font-semibold text-[#c4b5fd]">
                  Pro
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Ads this month</span>
              <span className="text-white">
                {planData.adsThisMonth} / {planData.limit}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-[#1a1a22] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899]"
                style={{
                  width: `${Math.min(
                    (planData.adsThisMonth / planData.limit) * 100,
                    100
                  ).toFixed(0)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-8 sm:mb-12 lg:mb-16">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    step.number <= currentStep
                      ? "bg-gradient-to-r from-[#6666FF] to-[#FF66FF] text-white"
                      : "border border-[#141533] bg-[#0d1117] text-zinc-400"
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium hidden sm:block ${
                    step.number <= currentStep
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
                      ? "bg-gradient-to-r from-[#6666FF] to-[#FF66FF]"
                      : "bg-[#1a1a22]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Strategy & Assets Section */}
        <section className="flex flex-col items-center px-2 sm:px-0">
          {/* Icon */}
          <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#6666FF] to-[#FF66FF] shadow-lg shadow-purple-500/40">
            <svg
              className="h-6 w-6 sm:h-7 sm:w-7 text-white"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="M390-120q-51 0-88-35.5T260-241q-60-8-100-53t-40-106q0-21 5.5-41.5T142-480q-11-18-16.5-38t-5.5-42q0-61 40-105.5t99-52.5q3-51 41-86.5t90-35.5q26 0 48.5 10t41.5 27q18-17 41-27t49-10q52 0 89.5 35t40.5 86q59 8 99.5 53T840-560q0 22-5.5 42T818-480q11 18 16.5 38.5T840-400q0 62-40.5 106.5T699-241q-5 50-41.5 85.5T570-120q-25 0-48.5-9.5T480-156q-19 17-42 26.5t-48 9.5Zm130-590v460q0 21 14.5 35.5T570-200q20 0 34.5-16t15.5-36q-21-8-38.5-21.5T550-306q-10-14-7.5-30t16.5-26q14-10 30-7.5t26 16.5q11 16 28 24.5t37 8.5q33 0 56.5-23.5T760-400q0-5-.5-10t-2.5-10q-17 10-36.5 15t-40.5 5q-17 0-28.5-11.5T640-440q0-17 11.5-28.5T680-480q33 0 56.5-23.5T760-560q0-33-23.5-56T680-640q-11 18-28.5 31.5T613-587q-16 6-31-1t-20-23q-5-16 1.5-31t22.5-20q15-5 24.5-18t9.5-30q0-21-14.5-35.5T570-760q-21 0-35.5 14.5T520-710Zm-80 460v-460q0-21-14.5-35.5T390-760q-21 0-35.5 14.5T340-710q0 16 9 29.5t24 18.5q16 5 23 20t2 31q-6 16-21 23t-31 1q-21-8-38.5-21.5T279-640q-32 1-55.5 24.5T200-560q0 33 23.5 56.5T280-480q17 0 28.5 11.5T320-440q0 17-11.5 28.5T280-400q-21 0-40.5-5T203-420q-2 5-2.5 10t-.5 10q0 33 23.5 56.5T280-320q20 0 37-8.5t28-24.5q10-14 26-16.5t30 7.5q14 10 16.5 26t-7.5 30q-14 19-32 33t-39 22q1 20 16 35.5t35 15.5q21 0 35.5-14.5T440-250Zm40-230Z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="mb-2 sm:mb-3 text-xl sm:text-2xl font-bold text-white text-center">
            Strategy &amp; Assets
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-center text-sm sm:text-base text-zinc-400 max-w-xl px-4">
            Review AI insights and upload your brand assets.
          </p>

          {/* Number of Ads Card */}
          <div className="w-full max-w-3xl rounded-2xl border border-[#141533] bg-[#0d1117] p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#818cf8]">
                  #
                </span>
                <h2 className="text-sm sm:text-base font-semibold text-white">
                  Number of Ads
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {adOptions.map((option) => {
                const isSelected = option.value === selectedAds;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedAds(option.value)}
                    className={`relative flex flex-col items-center justify-center rounded-xl border px-3 py-3 sm:px-4 sm:py-4 text-center transition-all ${
                      isSelected
                        ? "border-[#6666FF] bg-[#1b1b36] shadow-lg shadow-purple-500/30"
                        : "border-[#141533] bg-[#0a0a12] hover:border-[#312e81] hover:bg-[#11111c]"
                    }`}
                  >
                    {option.badge && (
                      <span className="absolute -top-2 right-2 rounded-full bg-[#4c1d95] px-2 py-0.5 text-[10px] font-semibold text-[#c4b5fd]">
                        {option.badge}
                      </span>
                    )}
                    <div className="flex flex-col items-center justify-center w-full">
                      <span
                        className={`text-xl sm:text-2xl font-bold ${
                          isSelected ? "text-white" : "text-zinc-100"
                        }`}
                      >
                        {option.value}
                      </span>
                      <span className="mt-1 text-[11px] sm:text-xs text-zinc-400 text-center w-full">
                        {option.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Banner Sizes Card */}
          <div className="w-full max-w-3xl mt-6 rounded-2xl border border-[#141533] bg-[#0d1117] p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-2">
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
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <h2 className="text-sm sm:text-base font-semibold text-white">
                Banner Sizes
              </h2>
              <span className="text-xs text-zinc-400">(select 1+)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {bannerSizes.map((banner) => {
                const isSelected = selectedBannerSizes.includes(banner.id);
                return (
                  <button
                    key={banner.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedBannerSizes(selectedBannerSizes.filter((id) => id !== banner.id));
                      } else {
                        setSelectedBannerSizes([...selectedBannerSizes, banner.id]);
                      }
                    }}
                    className={`relative flex flex-col items-center justify-center rounded-lg border px-3 py-3 text-center transition-all ${
                      isSelected
                        ? "border-[#a855f7] bg-[#1b1b36] shadow-lg shadow-purple-500/30"
                        : "border-[#141533] bg-[#0d1117] hover:border-[#312e81] hover:bg-[#11111c]"
                    }`}
                  >
                    <svg
                      className="h-5 w-5 mb-2"
                      viewBox="0 -960 960 960"
                      fill="#6a4cff"
                    >
                      <path d={banner.icon} />
                    </svg>
                    <span
                      className={`text-base font-bold mb-0.5 ${
                        isSelected ? "text-white" : "text-white"
                      }`}
                    >
                      {banner.name}
                    </span>
                    <span
                      className={`text-xs mb-0.5 ${
                        isSelected ? "text-white" : "text-white"
                      }`}
                    >
                      {banner.dimensions}
                    </span>
                    <span
                      className={`text-[10px] ${
                        isSelected ? "text-white" : "text-zinc-400"
                      }`}
                    >
                      {banner.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Banner Archetypes Card */}
          <div className="w-full max-w-3xl mt-6 rounded-2xl border border-[#141533] bg-[#0d1117] p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-[#6a4cff]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <h2 className="text-sm sm:text-base font-semibold text-white">
                  Banner Archetypes
                </h2>
                <span className="text-xs text-red-400">(required)</span>
              </div>
              <span className="text-xs text-green-400">
                — {selectedArchetypes.length}/{selectedArchetypes.length} selected
              </span>
            </div>

            {/* Quick Filters */}
            <div className="mb-6">
              <span className="text-xs text-white mb-2 block">Quick:</span>
              <div className="flex flex-wrap gap-2">
                {quickFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => {
                      const predefinedSelection = quickFilterSelections[filter] || [];
                      setSelectedArchetypes(predefinedSelection);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[#141533] bg-[#0d1117] text-xs text-white hover:border-[#312e81] hover:bg-[#11111c] transition-all"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Selection Summary */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm text-white">
                {selectedArchetypes.length} selected
              </span>
              <button
                type="button"
                onClick={() => {
                  const allIds = archetypeCategories.flatMap(cat => cat.archetypes.map(a => a.id));
                  if (selectedArchetypes.length === allIds.length) {
                    setSelectedArchetypes([]);
                  } else {
                    setSelectedArchetypes(allIds);
                  }
                }}
                className="text-xs text-[#6a4cff] hover:text-[#8a6cff] transition-colors"
              >
                Select all
              </button>
            </div>

            {/* Archetype Grid */}
            <div className="space-y-6">
              {archetypeCategories.map((category) => (
                <div key={category.name}>
                  <h3 className="text-[10px] uppercase tracking-wide text-zinc-400 mb-3">
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {category.archetypes.map((archetype) => {
                      const isSelected = selectedArchetypes.includes(archetype.id);
                      return (
                        <button
                          key={archetype.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedArchetypes(selectedArchetypes.filter(id => id !== archetype.id));
                            } else {
                              setSelectedArchetypes([...selectedArchetypes, archetype.id]);
                            }
                          }}
                          className={`relative flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-all ${
                            isSelected
                              ? "border-[#6666FF] bg-[#1b1b36] shadow-lg shadow-purple-500/30"
                              : "border-[#141533] bg-[#0d1117] hover:border-[#312e81] hover:bg-[#11111c]"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-[#6666FF] flex items-center justify-center">
                              <svg
                                className="h-2.5 w-2.5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          )}
                          <svg
                            className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                              isSelected ? "text-[#6666FF]" : "text-zinc-400"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d={archetype.icon} />
                          </svg>
                          <div className="flex flex-col min-w-0">
                            <span
                              className={`text-xs font-bold mb-0.5 ${
                                isSelected ? "text-white" : "text-white"
                              }`}
                            >
                              {archetype.name}
                            </span>
                            <span
                              className={`text-[9px] leading-tight ${
                                isSelected ? "text-zinc-300" : "text-zinc-400"
                              }`}
                            >
                              {archetype.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Status Bar */}
            {selectedArchetypes.length >= 3 && (
              <div className="mt-6 pt-4 border-t border-[#141533] flex items-center gap-2 text-sm text-green-400">
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
                <span>
                  All {selectedArchetypes.length} archetypes selected — ready to generate!
                </span>
              </div>
            )}
          </div>

          {/* Brand Assets Card */}
          <div className="w-full max-w-3xl mt-6 rounded-2xl border border-[#141533] bg-[#0d1117] p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-2">
              <svg
                className="h-5 w-5 text-[#6a4cff]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
              <h2 className="text-sm sm:text-base font-semibold text-white">
                Brand Assets
              </h2>
              <span className="text-xs text-zinc-400">(optional)</span>
            </div>

            {/* Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Brand Logo */}
              <div>
                {/* Brand Logo Header */}
                <div className="mb-4 flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-[#6a4cff]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-sm font-semibold text-white">Brand Logo</h3>
                  <span className="text-xs text-zinc-400">Optional • 0/1</span>
                </div>

                {/* Upload Area */}
                <div className="mb-4 rounded-lg border-2 border-dashed border-[#141533] bg-[#0a0a12] p-6 text-center cursor-pointer hover:border-[#6a4cff] transition-colors">
                  <svg
                    className="h-8 w-8 mx-auto mb-2 text-[#6a4cff]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm text-white mb-1">Tap to upload</p>
                  <p className="text-xs text-zinc-400">PNG, SVG or JPG • Max 5MB</p>
                </div>

                {/* Found on website */}
                {extractedLogo && (
                  <div className="mb-4">
                    <h4 className="text-xs text-zinc-400 mb-2">Found on website</h4>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-[#141533] bg-[#0a0a12]">
                      <div className="h-12 w-12 rounded bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {!logoError ? (
                          <img 
                            src={extractedLogo} 
                            alt="Website logo" 
                            className="h-full w-full object-contain"
                            onError={() => setLogoError(true)}
                          />
                        ) : (
                          <span className="text-white font-bold text-lg">L</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="text-xs text-[#6a4cff] hover:text-[#8a6cff] transition-colors"
                      >
                        Use this logo
                      </button>
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-zinc-400">
                  Upload your logo for branded banners
                </p>
              </div>

              {/* Right Column: Product Photos */}
              <div>
                {/* Product Photos Header */}
                <div className="mb-4 flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-[#6a4cff]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <h3 className="text-sm font-semibold text-white">Product Photos</h3>
                  <span className="text-xs text-zinc-400">Optional • 0/4</span>
                </div>

                {/* Upload Area */}
                <div className="mb-4 rounded-lg border-2 border-dashed border-[#141533] bg-[#0a0a12] p-6 text-center cursor-pointer hover:border-[#6a4cff] transition-colors">
                  <svg
                    className="h-8 w-8 mx-auto mb-2 text-[#6a4cff]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm text-white mb-1">Tap to upload</p>
                  <p className="text-xs text-zinc-400">JPG, PNG or WebP • Max 5MB</p>
                </div>

                {/* Found on website */}
                {extractedImages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs text-zinc-400 mb-2">Found on website</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {extractedImages.slice(0, 4).map((image, index) => {
                        const isSelected = selectedProductPhoto === index;
                        const shouldShow = selectedProductPhoto === null || isSelected;
                        
                        if (!shouldShow) return null;
                        
                        return (
                          <div
                            key={index}
                            className="group relative"
                          >
                            <div
                              className={`relative aspect-square rounded-lg border bg-[#0a0a12] overflow-hidden cursor-pointer transition-all ${
                                isSelected
                                  ? "border-[#6a4cff] border-2"
                                  : "border-[#141533] hover:border-[#6a4cff] hover:border-2"
                              }`}
                              onClick={() => setSelectedProductPhoto(isSelected ? null : index)}
                            >
                              {!imageErrors.has(index) ? (
                                <img
                                  src={image.src}
                                  alt={image.alt || `Product image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={() => setImageErrors(prev => new Set(prev).add(index))}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                                  <svg
                                    className="h-6 w-6 text-zinc-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              )}
                              {/* Hover Overlay */}
                              {!isSelected && (
                                <div className="absolute inset-0 bg-[#6a4cff]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedProductPhoto(index);
                                    }}
                                    className="px-4 py-2 rounded-lg bg-[#6a4cff] text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#7a5cff]"
                                  >
                                    Use
                                  </button>
                                </div>
                              )}
                            </div>
                            {/* Selected State - Red X on Hover (Outside the card) */}
                            {isSelected && (
                              <div 
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10 shadow-lg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProductPhoto(null);
                                }}
                              >
                                <svg
                                  className="h-4 w-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-zinc-400">
                  Upload product photos to feature in ads • Skip for AI visuals
                </p>
              </div>
            </div>

            {/* Footer Message */}
            <div className="mt-6 pt-4 border-t border-[#141533] flex items-center gap-2">
              <svg
                className="h-4 w-4 text-[#6a4cff]"
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
              <p className="text-xs text-zinc-400">
                No assets uploaded. AI will generate fully creative banners with AI-generated visuals.
              </p>
            </div>
          </div>

          {/* AI-Extracted Insights */}
          <div className="w-full max-w-3xl mt-6 rounded-2xl border border-[#141533] bg-[#0d1117] p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="h-5 w-5 text-[#6a4cff]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  AI-Extracted Insights
                </h2>
                <span className="ml-2 rounded-full bg-zinc-700/50 px-2.5 py-0.5 text-xs text-zinc-300">
                  Auto-filled
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Review and edit the data extracted from your website. This will be used to generate more accurate ads.
              </p>
            </div>

            {/* Product Info Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="h-4 w-4 text-[#6a4cff]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h3 className="text-sm font-semibold text-white">Product Info</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Product/Brand Name
                    </label>
                    <input
                      type="text"
                      value={productInfo.productName}
                      onChange={(e) => setProductInfo({ ...productInfo, productName: e.target.value })}
                      className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6a4cff] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={productInfo.industry}
                      onChange={(e) => setProductInfo({ ...productInfo, industry: e.target.value })}
                      className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6a4cff] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">
                    Tagline / Value Proposition
                  </label>
                  <input
                    type="text"
                    value={productInfo.tagline}
                    onChange={(e) => setProductInfo({ ...productInfo, tagline: e.target.value })}
                    className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6a4cff] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Offers Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="h-4 w-4 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-sm font-semibold text-white">Pricing & Offers</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Current Price
                    </label>
                    <input
                      type="text"
                      value={pricing.currentPrice}
                      onChange={(e) => setPricing({ ...pricing, currentPrice: e.target.value })}
                      className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6a4cff] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Original Price
                    </label>
                    <input
                      type="text"
                      value={pricing.originalPrice}
                      onChange={(e) => setPricing({ ...pricing, originalPrice: e.target.value })}
                      className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6a4cff] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Discount
                    </label>
                    <input
                      type="text"
                      value={pricing.discount}
                      onChange={(e) => setPricing({ ...pricing, discount: e.target.value })}
                      className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6a4cff] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      value={pricing.couponCode}
                      onChange={(e) => setPricing({ ...pricing, couponCode: e.target.value })}
                      className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6a4cff] transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Active Offer
                    </label>
                    <input
                      type="text"
                      value={pricing.activeOffer}
                      onChange={(e) => setPricing({ ...pricing, activeOffer: e.target.value })}
                      className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6a4cff] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Urgency Text
                    </label>
                    <input
                      type="text"
                      value={pricing.urgencyText}
                      onChange={(e) => setPricing({ ...pricing, urgencyText: e.target.value })}
                      className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6a4cff] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="h-4 w-4 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <h3 className="text-sm font-semibold text-white">Social Proof</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">
                    Rating
                  </label>
                  <input
                    type="text"
                    value={socialProof.rating}
                    onChange={(e) => setSocialProof({ ...socialProof, rating: e.target.value })}
                    className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6a4cff] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">
                    Review Count
                  </label>
                  <input
                    type="text"
                    value={socialProof.reviewCount}
                    onChange={(e) => setSocialProof({ ...socialProof, reviewCount: e.target.value })}
                    className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6a4cff] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">
                    Customers
                  </label>
                  <input
                    type="text"
                    value={socialProof.customers}
                    onChange={(e) => setSocialProof({ ...socialProof, customers: e.target.value })}
                    className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6a4cff] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Key Features Section */}
            <div className="mt-6 pt-6 border-t border-[#141533]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-[#6a4cff]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <h3 className="text-sm font-semibold text-white">Key Features</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newFeature = prompt("Enter a new feature:");
                    if (newFeature) {
                      setKeyFeatures([...keyFeatures, newFeature]);
                    }
                  }}
                  className="text-xs text-[#6a4cff] hover:text-[#8a6cff] transition-colors"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="group relative flex items-center">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const updated = [...keyFeatures];
                        updated[index] = e.target.value;
                        setKeyFeatures(updated);
                      }}
                      className="flex-1 rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6a4cff] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
                      }}
                      className="ml-2 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="mt-6 pt-6 border-t border-[#141533]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-[#6a4cff]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <h3 className="text-sm font-semibold text-white">Testimonials</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTestimonials([
                      ...testimonials,
                      { quote: "", author: "", title: "" }
                    ]);
                  }}
                  className="flex items-center gap-1.5 text-xs text-[#6a4cff] hover:text-[#8a6cff] transition-colors"
                >
                  <span className="text-[#6a4cff] text-xs">+</span>
                  <span>Add</span>
                </button>
              </div>
              {testimonials.length === 0 ? (
                <p className="text-xs text-zinc-400">
                  No testimonials extracted. Click "Add" to add manually.
                </p>
              ) : (
                <div className="space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="relative rounded-lg border border-[#141533] bg-[#0a0a12] p-4">
                      {/* Quote Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-white">Quote #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setTestimonials(testimonials.filter((_, i) => i !== index));
                          }}
                          className="h-5 w-5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Customer Testimonial Textarea */}
                      <textarea
                        value={testimonial.quote}
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[index] = { ...updated[index], quote: e.target.value };
                          setTestimonials(updated);
                        }}
                        placeholder="Customer testimonial..."
                        className="w-full rounded-lg border border-[#141533] bg-[#0d1117] px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#6a4cff] transition-colors resize-none"
                        rows={4}
                      />
                      
                      {/* Author and Title Inputs */}
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <input
                          type="text"
                          value={testimonial.author}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index] = { ...updated[index], author: e.target.value };
                            setTestimonials(updated);
                          }}
                          placeholder="Author name"
                          className="rounded-lg border border-[#141533] bg-[#0d1117] px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#6a4cff] transition-colors"
                        />
                        <input
                          type="text"
                          value={testimonial.title || ""}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index] = { ...updated[index], title: e.target.value };
                            setTestimonials(updated);
                          }}
                          placeholder="Title (optional)"
                          className="rounded-lg border border-[#141533] bg-[#0d1117] px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#6a4cff] transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trust Signals Section */}
            <div className="mt-6 pt-6 border-t border-[#141533]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <h3 className="text-sm font-semibold text-white">Trust Signals</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTrustSignals([...trustSignals, ""]);
                  }}
                  className="text-xs text-[#6a4cff] hover:text-[#8a6cff] transition-colors"
                >
                  + Add
                </button>
              </div>
              {trustSignals.length === 0 ? (
                <p className="text-xs text-zinc-400">
                  No trust signals extracted. Click "Add" to add manually.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {trustSignals.map((signal, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#10192d] px-3 py-1.5"
                    >
                      <input
                        type="text"
                        value={signal}
                        onChange={(e) => {
                          const updated = [...trustSignals];
                          updated[index] = e.target.value;
                          setTrustSignals(updated);
                        }}
                        placeholder="Trust signal..."
                        className="bg-transparent border-none outline-none text-xs text-white min-w-[60px] focus:outline-none placeholder:text-zinc-500"
                        style={{ width: `${Math.max((signal.length || 15) * 6 + 20, 70)}px` }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setTrustSignals(trustSignals.filter((_, i) => i !== index));
                        }}
                        className="flex items-center justify-center text-white hover:text-zinc-300 transition-colors cursor-pointer flex-shrink-0"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTAs Found Section */}
            <div className="mt-6 pt-6 border-t border-[#141533]">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="h-4 w-4 text-[#6a4cff]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="text-sm font-semibold text-white">CTAs Found</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {ctas.map((cta, index) => (
                  <button
                    key={index}
                    type="button"
                    className="rounded-full border border-[#6a4cff]/30 bg-[#0a0a12] px-3 py-1.5 text-xs text-white hover:border-[#6a4cff]/50 transition-all shadow-sm"
                    style={{
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                      boxShadow: '0 0 0 1px rgba(106, 76, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {cta}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="w-full max-w-3xl mt-6 rounded-2xl border border-[#141533] bg-[#0d1117] p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-2">
              <svg
                className="h-5 w-5 text-[#6a4cff]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" />
              </svg>
              <h2 className="text-base sm:text-lg font-semibold text-white">
                AI Insights
              </h2>
            </div>

            {/* Content Sections */}
            <div className="space-y-4">
              {/* Unique Selling Proposition */}
              {aiInsights.uniqueSellingProposition && (
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">
                    Unique Selling Proposition (USP)
                  </h3>
                  <textarea
                    value={aiInsights.uniqueSellingProposition}
                    onChange={(e) => {
                      setAiInsights({
                        ...aiInsights,
                        uniqueSellingProposition: e.target.value,
                      });
                    }}
                    className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] p-4 text-sm text-white leading-relaxed focus:outline-none focus:border-[#6a4cff] transition-colors resize-none min-h-[80px]"
                    rows={4}
                  />
                </div>
              )}

              {/* Target Audience and Current Offer - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Audience */}
                {aiInsights.targetAudience && (
                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium text-white mb-2">
                      Target Audience
                    </h3>
                    <textarea
                      value={aiInsights.targetAudience}
                      onChange={(e) => {
                        setAiInsights({
                          ...aiInsights,
                          targetAudience: e.target.value,
                        });
                      }}
                      className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] p-4 text-sm text-white leading-relaxed focus:outline-none focus:border-[#6a4cff] transition-colors resize-none h-32 overflow-y-auto scrollbar-hide"
                      rows={4}
                    />
                  </div>
                )}

                {/* Current Offer */}
                {aiInsights.currentOffer && (
                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium text-white mb-2">
                      Current Offer
                    </h3>
                    <textarea
                      value={aiInsights.currentOffer}
                      onChange={(e) => {
                        setAiInsights({
                          ...aiInsights,
                          currentOffer: e.target.value,
                        });
                      }}
                      className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] p-4 text-sm text-white leading-relaxed focus:outline-none focus:border-[#6a4cff] transition-colors resize-none h-32 overflow-y-auto scrollbar-hide"
                      rows={4}
                    />
                  </div>
                )}
              </div>

              {/* Brand Tone & Voice */}
              {aiInsights.brandToneAndVoice && (
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">
                    Brand Tone & Voice
                  </h3>
                  <textarea
                    value={aiInsights.brandToneAndVoice}
                    onChange={(e) => {
                      setAiInsights({
                        ...aiInsights,
                        brandToneAndVoice: e.target.value,
                      });
                    }}
                    className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] p-4 text-sm text-white leading-relaxed focus:outline-none focus:border-[#6a4cff] transition-colors resize-none min-h-[80px]"
                    rows={4}
                  />
                </div>
              )}

              {/* Show message if no AI insights available */}
              {!aiInsights.uniqueSellingProposition && 
               !aiInsights.targetAudience && 
               !aiInsights.currentOffer && 
               !aiInsights.brandToneAndVoice && (
                <div className="rounded-lg border border-[#141533] bg-[#0a0a12] p-4">
                  <p className="text-sm text-zinc-400 text-center">
                    AI insights are being generated. Please check back shortly.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="w-full max-w-3xl mt-8 flex items-center justify-between">
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

            {/* Generate 3 Ads Button */}
            <button
              onClick={() => router.push('/dashboard/generate/banners')}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-6 py-3 text-white font-medium transition-all hover:from-[#9333ea] hover:to-[#db2777] shadow-lg shadow-purple-500/20"
            >
              <span>Generate 3 Ads</span>
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



        </section>
      </main>
    </div>
  );
}

