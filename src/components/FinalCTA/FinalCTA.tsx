"use client";

import Link from "next/link";

const features = [
  "20 proven archetypes",
  "Auto-extract brand assets",
  "Regenerate copy instantly",
  "4 banner sizes",
];

const trustBadges = [
  "5 Free Ads",
  "No Credit Card",
  "Cancel Anytime",
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-4 w-4 text-purple-400"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function FinalCTA() {
  return (
    <section className="flex flex-col items-center px-6 py-20">
      <div className="w-full max-w-4xl rounded-2xl border border-purple-500/20 bg-[#0c0c18] p-8 shadow-[0_0_80px_rgba(168,85,247,0.1)] md:p-12">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2">
            <span className="text-sm">⚡</span>
            <span className="text-sm font-medium text-purple-400">Stop Wasting Hours</span>
          </div>
        </div>

        {/* Headline */}
        <h2 className="mt-6 text-center text-3xl font-bold text-white md:text-4xl">
          Ready to Create{" "}
          <span className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
            Winning Ads?
          </span>
        </h2>

        {/* Subheadline */}
        <p className="mt-4 text-center text-zinc-400">
          Join thousands of marketers who've transformed their ad creation workflow.
        </p>

        {/* Features Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <CheckIcon />
              <span className="text-sm text-zinc-300">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-8 py-3.5 font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Generate Your First Ad
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="#pricing"
            className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-white transition-all hover:text-zinc-300"
          >
            View Pricing
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {trustBadges.map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-green-400" />
              <span className="text-sm text-zinc-400">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

