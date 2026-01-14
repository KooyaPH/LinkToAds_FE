"use client";

import Image from "next/image";
import { Ad } from "./ProjectAdCard";

interface AdLightboxProps {
  ad: Ad | null;
  onClose: () => void;
  onDownload: (ad: Ad) => void;
}

export default function AdLightbox({ ad, onClose, onDownload }: AdLightboxProps) {
  if (!ad) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-xl bg-[#0d1117]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image */}
        <div className="relative aspect-square w-full max-w-2xl">
          <Image
            src={ad.image_url}
            alt={ad.title}
            fill
            className="object-contain"
          />
        </div>

        {/* Info */}
        <div className="border-t border-[#1a1a22] p-4">
          <h3 className="mb-2 text-lg font-semibold text-white">{ad.title}</h3>
          {ad.content && (
            <p className="mb-4 text-sm text-zinc-400">{ad.content}</p>
          )}
          <button
            onClick={() => onDownload(ad)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#5555DD] to-[#DD55DD] px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
