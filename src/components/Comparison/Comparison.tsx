"use client";

import { useState } from "react";

const features = [
  { name: "AI-Generated Copy", linkToAds: true, agencies: false, diy: false },
  { name: "Auto Brand & Image Extraction", linkToAds: true, agencies: false, diy: false },
  { name: "20 Proven Ad Archetypes", linkToAds: true, agencies: false, diy: false },
  { name: "1-Click Copy Regeneration", linkToAds: true, agencies: false, diy: false },
  { name: "Multiple Banner Sizes", linkToAds: true, agencies: true, diy: false },
  { name: "Ready in Under 60 Seconds", linkToAds: true, agencies: false, diy: false },
  { name: "Copy Length Options", linkToAds: true, agencies: true, diy: false },
  { name: "No Design Skills Needed", linkToAds: true, agencies: true, diy: false },
  { name: "Affordable Pricing", linkToAds: true, agencies: false, diy: true },
  { name: "Professional Quality", linkToAds: true, agencies: true, diy: false },
];

type TabType = "linkToAds" | "agencies" | "diy";

function CheckIcon() {
  return (
    <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-5 w-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function Comparison() {
  const [activeTab, setActiveTab] = useState<TabType>("linkToAds");

  const getFeatureCount = (tab: TabType) => {
    return features.filter((f) => f[tab]).length;
  };

  const tabs = [
    { id: "linkToAds" as TabType, label: "LinkToAds" },
    { id: "agencies" as TabType, label: "Agencies" },
    { id: "diy" as TabType, label: "DIY Tools" },
  ];

  return (
    <section className="flex flex-col items-center px-6 py-20">
      {/* Headline */}
      <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
        Why Choose{" "}
        <span className="bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
          LinkToAds
        </span>
      </h2>

      {/* Subheadline */}
      <p className="mt-4 max-w-xl text-center text-zinc-400">
        See how we compare to traditional agencies and DIY approaches.
      </p>

      {/* Mobile Layout */}
      <div className="mt-12 w-full max-w-md md:hidden">
        {/* Tabs */}
        <div className="flex rounded-lg border border-white/10 bg-[#0d0d1a] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#22d3ee] to-[#a855f7] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Features List */}
        <div className="mt-4 rounded-xl border border-white/10 bg-[#0d0d1a] p-4">
          <div className="space-y-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex items-center gap-3">
                {feature[activeTab] ? <CheckIcon /> : <XIcon />}
                <span className="text-sm text-zinc-300">{feature.name}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-sm text-zinc-400">
              <span className="bg-gradient-to-r from-[#22d3ee] to-[#a855f7] bg-clip-text font-semibold text-transparent">
                {getFeatureCount(activeTab)}/10
              </span>{" "}
              Features
            </span>
            {activeTab === "linkToAds" && (
              <span className="rounded-full bg-gradient-to-r from-[#22d3ee] to-[#a855f7] px-3 py-1 text-xs font-semibold text-white">
                Best Choice
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Card Style */}
      <div className="mt-16 hidden w-full max-w-5xl md:block">
        <div className="flex gap-4">
          {/* Feature Names Column */}
          <div className="w-48 flex-shrink-0 pt-16">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className={`flex h-12 items-center ${
                  index < features.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                <span className="text-sm text-zinc-300">{feature.name}</span>
              </div>
            ))}
          </div>

          {/* LinkToAds Card */}
          <div className="relative flex-1 rounded-xl border-2 border-purple-500/50 bg-[#0d0d1a] shadow-[0_0_30px_rgba(168,85,247,0.3),0_0_60px_rgba(168,85,247,0.1)]">
            {/* Best Choice Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="whitespace-nowrap rounded-full bg-gradient-to-r from-[#22d3ee] to-[#a855f7] px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
                Best Choice
              </span>
            </div>

            {/* Header */}
            <div className="flex h-16 items-center justify-center border-b border-white/10">
              <span className="bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#ec4899] bg-clip-text text-base font-semibold text-transparent">
                LinkToAds
              </span>
            </div>

            {/* Features */}
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className={`flex h-12 items-center justify-center ${
                  index < features.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                {feature.linkToAds ? <CheckIcon /> : <XIcon />}
              </div>
            ))}
          </div>

          {/* Agencies Card */}
          <div className="flex-1 rounded-xl border border-white/10 bg-[#0d0d1a]">
            {/* Header */}
            <div className="flex h-16 items-center justify-center border-b border-white/10">
              <span className="text-base font-semibold text-zinc-400">Agencies</span>
            </div>

            {/* Features */}
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className={`flex h-12 items-center justify-center ${
                  index < features.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                {feature.agencies ? <CheckIcon /> : <XIcon />}
              </div>
            ))}
          </div>

          {/* DIY Tools Card */}
          <div className="flex-1 rounded-xl border border-white/10 bg-[#0d0d1a]">
            {/* Header */}
            <div className="flex h-16 items-center justify-center border-b border-white/10">
              <span className="text-base font-semibold text-zinc-400">DIY Tools</span>
            </div>

            {/* Features */}
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className={`flex h-12 items-center justify-center ${
                  index < features.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                {feature.diy ? <CheckIcon /> : <XIcon />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
