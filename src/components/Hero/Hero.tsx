"use client";

import AdShowcase from "@/components/AdShowcase";
import TrustSection from "@/components/TrustSection";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import Testimonials from "@/components/Testimonials";
import Comparison from "@/components/Comparison";
import BusinessTypes from "@/components/BusinessTypes";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

const features = [
  { icon: "🎯", label: "20 Ad Archetypes" },
  { icon: "🤖", label: "AI Copy Regen" },
  { icon: "🖼️", label: "4 Banner Sizes" },
  { icon: "🚀", label: "Conversion Optimized" },
  { icon: "🎨", label: "Brand Kits" },
];

export default function Hero() {
  return (
    <>
    <section className="flex flex-col items-center justify-center px-6 pt-24 pb-4 text-center">
      {/* Badge */}
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L14.59 9L22 11L14.59 13L12 20L9.41 13L2 11L9.41 9L12 2Z"
            fill="#7F52FF"
            stroke="#7F52FF"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 0.5px rgba(127, 82, 255, 0.5))" }}
          />
          <circle cx="19" cy="5" r="1.5" fill="#7F52FF" />
          <circle cx="5" cy="19" r="1.5" fill="#7F52FF" />
        </svg>
        <span className="text-sm font-medium text-zinc-300">
          AI-Powered Ad Generation
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="max-w-5xl text-5xl font-extrabold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl xl:text-8xl">
        Turn Any Website into{" "}
        <br />
        <span className="bg-gradient-to-r from-[#6666FF] to-[#FF66FF] bg-clip-text text-transparent">
          10+ Facebook Ads
        </span>
      </h1>

      {/* Subheadline */}
      <p className="mt-6 max-w-2xl text-lg text-zinc-400 md:text-xl">
        Paste your URL and get launch-ready ad creatives and
        <br className="hidden md:block" />
        copy in under 60 seconds
      </p>

      {/* Features Marquee */}
      <div className="mt-8 w-full max-w-5xl overflow-hidden">
        <div className="animate-marquee flex w-max gap-4">
          {/* First set */}
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm"
            >
              <span className="text-base">{feature.icon}</span>
              <span className="whitespace-nowrap text-sm font-medium text-zinc-300">
                {feature.label}
              </span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {features.map((feature, index) => (
            <div
              key={`dup-${index}`}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm"
            >
              <span className="text-base">{feature.icon}</span>
              <span className="whitespace-nowrap text-sm font-medium text-zinc-300">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* URL Input Section */}
    <section className="flex flex-col items-center px-6 pt-8 pb-16">
      {/* Input and Button Container */}
      <div className="flex w-full max-w-xl items-center gap-3">
        {/* Input Field */}
        <div className="flex flex-1 items-center gap-3 rounded-lg border border-white/10 bg-[#1a1a2e] px-4 py-3">
          {/* Link Icon */}
          <svg
            className="h-5 w-5 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>

          {/* Input */}
          <input
            type="text"
            placeholder="yourbusiness.com"
            className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
          />
        </div>

        {/* Generate Button */}
        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] px-6 py-3.5 font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25">
          Generate Ads
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Free Ads Notice */}
      <p className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
        <span>✨</span>
        <span>5 free ads included – No credit card required</span>
      </p>
    </section>

    <AdShowcase />

    <TrustSection />

    <Features />

    <HowItWorks />

    <CTA />

    <Testimonials />

    <Comparison />

    <BusinessTypes />

    <Pricing />

    <FAQ />

    <FinalCTA />
    </>
  );
}

