"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="w-screen border-y border-white/10 bg-[#0d0d1a] px-6 py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#10122c] px-3 py-1.5">
          <span className="text-xs">✨</span>
          <span className="text-xs font-medium text-[#6348f0]">
            Ready to transform your ads?
          </span>
        </div>

        {/* Headline */}
        <h2 className="max-w-2xl text-center text-2xl font-bold text-white md:text-3xl">
          Start Creating{" "}
          <span className="bg-gradient-to-r from-[#6666FF] to-[#FF66FF] bg-clip-text text-transparent">
            High-Converting Ads
          </span>{" "}
          Today
        </h2>

        {/* Subheadline */}
        <p className="mt-3 max-w-lg text-center text-sm text-zinc-400">
          Join thousands of marketers who've already discovered the power of AI-generated ad creatives.
        </p>

        {/* CTA Button */}
        <Link
          href="/pricing"
          className="mt-6 inline-flex items-center gap-2 rounded bg-gradient-to-r from-[#6666FF] to-[#FF66FF] px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25"
        >
          Pick Your Plan
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
        </Link>
      </div>
    </section>
  );
}

