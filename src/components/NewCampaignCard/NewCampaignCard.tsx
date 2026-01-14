"use client";

import Link from "next/link";

export default function NewCampaignCard() {
  return (
    <Link
      href="/dashboard/generate"
      className="group flex flex-col items-center justify-center overflow-hidden rounded-xl border border-[#1a1a22] bg-[#0d1117] transition-all hover:border-[#2a2a32]"
      style={{ minHeight: "calc(100% - 0px)" }}
    >
      <div className="flex flex-col items-center justify-center py-16">
        {/* Plus Icon */}
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a2e] transition-colors group-hover:bg-[#252538]">
          <svg
            className="h-5 w-5 text-[#6a4cff]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        {/* Label */}
        <span className="text-sm font-medium text-white">New Campaign</span>
      </div>
    </Link>
  );
}
