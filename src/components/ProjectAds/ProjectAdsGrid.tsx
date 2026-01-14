"use client";

import ProjectAdCard, { Ad } from "./ProjectAdCard";

interface ProjectAdsGridProps {
  ads: Ad[];
  onView: (ad: Ad) => void;
  onDownload: (ad: Ad) => void;
  onDelete?: (ad: Ad) => void;
  formatDate: (date: string) => string;
  deletingAdId?: string | null;
  brandName?: string;
}

export default function ProjectAdsGrid({
  ads,
  onView,
  onDownload,
  onDelete,
  formatDate,
  deletingAdId,
  brandName,
}: ProjectAdsGridProps) {
  if (ads.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-[#1a1a22] bg-[#0d1117] px-12 py-8">
        <svg
          className="h-12 w-12 text-zinc-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-zinc-400">No ads in this project yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {ads.map((ad) => (
        <ProjectAdCard
          key={ad.id}
          ad={ad}
          onView={onView}
          onDownload={onDownload}
          onDelete={onDelete}
          formatDate={formatDate}
          isDeleting={deletingAdId === ad.id}
          brandName={brandName}
        />
      ))}
    </div>
  );
}
