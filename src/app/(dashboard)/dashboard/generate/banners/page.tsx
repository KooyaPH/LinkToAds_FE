"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BannersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="flex h-[73px] items-center border-b border-[#1a183e] px-8">
        <Link
          href="/dashboard/generate/strategy"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
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
          Back to Strategy
        </Link>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-white mb-8">Banners</h1>
          
          {/* Placeholder content */}
          <div className="rounded-lg border border-[#1a183e] bg-[#0d1117] p-12 text-center">
            <p className="text-zinc-400">Banners page content will be displayed here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
