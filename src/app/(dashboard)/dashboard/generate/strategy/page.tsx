"use client";

import { useState } from "react";
import Link from "next/link";

const steps = [
  { number: 1, label: "URL" },
  { number: 2, label: "Strategy" },
  { number: 3, label: "Banners" },
  { number: 4, label: "Results" },
];

// Mock data - would come from API/auth state
const planData = {
  plan: "Pro",
  adsThisMonth: 3,
  limit: 200,
};

const adOptions = [
  { value: 3, label: "Quick test", badge: null as string | null },
  { value: 5, label: "Best", badge: null as string | null },
  { value: 8, label: "More variety", badge: null as string | null },
  { value: 10, label: "Maximum", badge: null as string | null },
  { value: 20, label: "Pro", badge: "PRO" as string | null },
];

const bannerSizes = [
  { 
    id: "square", 
    name: "Square", 
    dimensions: "1080×1080", 
    description: "Feed, Carousel",
    icon: "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0 0v-560 560Z"
  },
  { 
    id: "portrait", 
    name: "Portrait", 
    dimensions: "1080×1350", 
    description: "Feed (optimal)",
    icon: "M720-80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80h480v-640H240v640Zm0 0v-640 640Z"
  },
  { 
    id: "story", 
    name: "Story", 
    dimensions: "1080x1920", 
    description: "Stories, Reels",
    icon: "M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v124q18 7 29 22t11 34v80q0 19-11 34t-29 22v404q0 33-23.5 56.5T680-40H280Zm0-80h400v-720H280v720Zm0 0v-720 720Zm120-40h160q17 0 28.5-11.5T600-200q0-17-11.5-28.5T560-240H400q-17 0-28.5 11.5T360-200q0 17 11.5 28.5T400-160Z"
  },
  { 
    id: "landscape", 
    name: "Landscape", 
    dimensions: "1200×628", 
    description: "Link ads",
    icon: "M200-280q-33 0-56.5-23.5T120-360v-240q0-33 23.5-56.5T200-680h560q33 0 56.5 23.5T840-600v240q0 33-23.5 56.5T760-280H200Zm0-80h560v-240H200v240Zm0 0v-240 240Z"
  },
];

interface Archetype {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

const archetypeCategories = [
  {
    name: "NATIVE/ORGANIC",
    archetypes: [
      { id: "lofi", name: "Lo-Fi", description: "iPhone-style casual shot", icon: "M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14 14 11.99 14 9.5 11.99 5 9.5 5z" },
      { id: "ugc", name: "UGC", description: "TikTok creator review style", icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" },
      { id: "meme", name: "Meme", description: "Organic meme format", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
      { id: "messages", name: "Messages", description: "iMessage conversation", icon: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" },
    ],
  },
  {
    name: "SOCIAL PROOF",
    archetypes: [
      { id: "5star", name: "5-Star", description: "Gold star testimonial", icon: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" },
      { id: "quote", name: "Quote", description: "Customer quote + photo", icon: "M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" },
      { id: "comments", name: "Comments", description: "Social comments praising product", icon: "M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" },
      { id: "stats", name: "Stats", description: "Giant statistic focal point", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" },
    ],
  },
  {
    name: "URGENCY/SALES",
    archetypes: [
      { id: "price", name: "Price", description: "Crossed-out price + discount", icon: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" },
      { id: "timer", name: "Timer", description: "Limited time countdown", icon: "M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" },
      { id: "airdrop", name: "AirDrop", description: "iOS notification popup", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
      { id: "notify", name: "Notify", description: "Lock screen notification", icon: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" },
    ],
  },
  {
    name: "EDUCATIONAL",
    archetypes: [
      { id: "listicle", name: "Listicle", description: "Numbered benefits list", icon: "M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-8h14V7H7v2z" },
      { id: "grid", name: "Grid", description: "3-4 benefits in grid", icon: "M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" },
      { id: "split", name: "Split", description: "Before vs After", icon: "M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14 14 11.99 14 9.5 11.99 5 9.5 5z" },
      { id: "compare", name: "Compare", description: "Competitor comparison", icon: "M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22v-2h-7.01V5L13 9l3.99 4z" },
    ],
  },
  {
    name: "PRODUCT FOCUS",
    archetypes: [
      { id: "lifestyle", name: "Lifestyle", description: "Product in real-world use", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
      { id: "unbox", name: "Unbox", description: "Package opening moment", icon: "M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" },
      { id: "app", name: "App", description: "App-style rating card", icon: "M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" },
      { id: "minimal", name: "Minimal", description: "Clean, 80% whitespace", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" },
    ],
  },
];

const quickFilters = ["Ecommerce", "Saas", "Services", "Restaurant"];

export default function StrategyPage() {
  const [currentStep] = useState(2);
  const [selectedAds, setSelectedAds] = useState<number>(5);
  const [selectedBannerSizes, setSelectedBannerSizes] = useState<string[]>(["square"]);
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>(["lofi", "5star", "lifestyle"]);
  const [selectedProductPhoto, setSelectedProductPhoto] = useState<number | null>(null);
  
  // AI-Extracted Insights state
  const [productInfo, setProductInfo] = useState({
    productName: "Affordable Memorial Plans",
    industry: "DeathCare Services",
    tagline: "Check out our Affordable Life Plans in the Philippines, available now from our St Peter Online Store.",
  });
  
  const [pricing, setPricing] = useState({
    currentPrice: "₱ 3,00",
    originalPrice: "₱ 2,37",
    discount: "10% discount",
    couponCode: "SAVE20",
    activeOffer: "Free shipping over $50",
    urgencyText: "Ends tonight!",
  });
  
  const [socialProof, setSocialProof] = useState({
    rating: "4.8/5",
    reviewCount: "2,500+",
    customers: "50,000+",
  });
  
  const [keyFeatures, setKeyFeatures] = useState<string[]>([
    "Traditional Plans",
    "Cremation Plans",
    "Online Payment for Plans",
    "Online Claim Application",
  ]);
  
  const [testimonials, setTestimonials] = useState<string[]>([]);
  
  const [trustSignals, setTrustSignals] = useState<string[]>([
    "Established in 1970, it has maintained its leadership and excelled in its role as DeathCare Experts in the DeathCare Services Industry.",
  ]);
  
  const [ctas, setCtas] = useState<string[]>([
    "Sign Up",
    "Signup",
    "Learn More",
    "Buy Now",
  ]);

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
                <div className="mb-4">
                  <h4 className="text-xs text-zinc-400 mb-2">Found on website</h4>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-[#141533] bg-[#0a0a12]">
                    <div className="h-12 w-12 rounded bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-[#6a4cff] hover:text-[#8a6cff] transition-colors"
                    >
                      Use this logo
                    </button>
                  </div>
                </div>

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
                <div className="mb-4">
                  <h4 className="text-xs text-zinc-400 mb-2">Found on website</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((index) => {
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
                    <div className="flex-1 rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2">
                      <span className="text-sm text-white">{feature}</span>
                    </div>
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
                    const newTestimonial = prompt("Enter a new testimonial:");
                    if (newTestimonial) {
                      setTestimonials([...testimonials, newTestimonial]);
                    }
                  }}
                  className="text-xs text-[#6a4cff] hover:text-[#8a6cff] transition-colors"
                >
                  + Add
                </button>
              </div>
              {testimonials.length === 0 ? (
                <p className="text-xs text-zinc-400">
                  No testimonials extracted. Click "Add" to add manually.
                </p>
              ) : (
                <div className="space-y-2">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="group relative flex items-center">
                      <div className="flex-1 rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2">
                        <span className="text-sm text-white">{testimonial}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTestimonials(testimonials.filter((_, i) => i !== index));
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
              )}
            </div>

            {/* Trust Signals Section */}
            <div className="mt-6 pt-6 border-t border-[#141533]">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <h3 className="text-sm font-semibold text-white">Trust Signals</h3>
              </div>
              <div className="space-y-2">
                {trustSignals.map((signal, index) => (
                  <div key={index} className="group relative flex items-center">
                    <div className="flex-1 rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2">
                      <span className="text-sm text-white">{signal}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTrustSignals(trustSignals.filter((_, i) => i !== index));
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
                    className="rounded-lg border border-[#141533] bg-[#0a0a12] px-4 py-2 text-sm text-white hover:border-[#6a4cff] transition-colors"
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
              <div>
                <h3 className="text-sm font-medium text-white mb-2">
                  Unique Selling Proposition (USP)
                </h3>
                <div className="rounded-lg border border-[#141533] bg-[#0a0a12] p-4">
                  <p className="text-sm text-white leading-relaxed">
                    St. Peter Life Plan offers affordable, anti-inflationary pre-need memorial plans (Traditional and Cremation) online, guaranteeing peace of mind and convenience for Filipino families.
                  </p>
                </div>
              </div>

              {/* Target Audience and Current Offer - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Audience */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">
                    Target Audience
                  </h3>
                  <div className="rounded-lg border border-[#141533] bg-[#0a0a12] p-4">
                    <p className="text-sm text-white leading-relaxed">
                      Filipino adults, particularly heads of households or those responsible for family planning, who are pragmatic, financially conscious, and seeking a reliable solution for their family's future needs.
                    </p>
                  </div>
                </div>

                {/* Current Offer */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">
                    Current Offer
                  </h3>
                  <div className="rounded-lg border border-[#141533] bg-[#0a0a12] p-4">
                    <p className="text-sm text-white leading-relaxed">
                      Online purchase of Traditional and Cremation Plans, online payment, and claims application.
                    </p>
                  </div>
                </div>
              </div>

              {/* Brand Tone & Voice */}
              <div>
                <h3 className="text-sm font-medium text-white mb-2">
                  Brand Tone & Voice
                </h3>
                <div className="rounded-lg border border-[#141533] bg-[#0a0a12] p-4">
                  <p className="text-sm text-white leading-relaxed">
                    Trustworthy, caring, professional, and empathetic, with an emphasis on convenience and peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </div>


        </section>
      </main>
    </div>
  );
}

