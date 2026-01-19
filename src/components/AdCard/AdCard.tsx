"use client";

import { useState, useEffect } from "react";
import Toast from "@/components/Toast";

interface AdCardProps {
  banner: {
    id: number;
    image?: string | null;
    label?: string;
    size?: string;
    archetype?: string;
  };
  brandName?: string;
  adCopy?: string;
  context?: string;
  caption?: {
    header?: string;
    main?: string;
  };
  onCopy?: () => void;
  onRegenerate?: () => void;
  onRegenerateCopy?: () => void;
  onDownload?: () => void;
  isEditingMode?: boolean;
  onAdCopyChange?: (bannerId: number, newCopy: string) => void;
  isLoadingCopy?: boolean;
}

export default function AdCard({
  banner,
  brandName = "Your Brand",
  adCopy = "Discover our amazing products and services designed to help you achieve your goals.",
  context = "Lifestyle Context",
  caption,
  onCopy,
  onRegenerate,
  onRegenerateCopy,
  onDownload,
  isEditingMode = false,
  onAdCopyChange,
  isLoadingCopy = false,
}: AdCardProps) {
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [editedCopy, setEditedCopy] = useState(adCopy);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Ad text copied!");
  const RECOMMENDED_CHAR_LIMIT = 125;
  
  // Sync editedCopy when adCopy prop changes
  useEffect(() => {
    if (!isEditingText) {
      setEditedCopy(adCopy);
    }
  }, [adCopy, isEditingText]);
  
  // Generate default caption if not provided
  const defaultCaption = {
    header: "ENSURE YOUR LOVED ONES ARE COVERE...",
    main: "Peace of Mind? Secure Your Family's Future Easily!",
  };
  
  const finalCaption = caption || defaultCaption;
  const displayCopy = showSeeMore ? adCopy : (adCopy.length > 120 ? adCopy.substring(0, 120) + "..." : adCopy);
  
  // Handle text click - only enable editing if editing mode is on
  const handleTextClick = () => {
    if (isEditingMode && !isEditingText) {
      setIsEditingText(true);
      setEditedCopy(adCopy);
    }
  };
  
  // Handle save
  const handleSave = () => {
    if (onAdCopyChange) {
      onAdCopyChange(banner.id, editedCopy);
    }
    setIsEditingText(false);
  };
  
  // Handle cancel
  const handleCancel = () => {
    setEditedCopy(adCopy);
    setIsEditingText(false);
  };
  
  const charCount = editedCopy.length;
  const isOverLimit = charCount > RECOMMENDED_CHAR_LIMIT;

  // Handle copy button click
  const handleCopy = () => {
    // Copy ad copy to clipboard
    navigator.clipboard.writeText(adCopy);
    // Show toast
    setToastMessage("Ad text copied!");
    setShowToast(true);
    // Call the onCopy callback if provided
    onCopy?.();
  };

  // Handle regenerate button click
  const handleRegenerate = () => {
    // Show toast
    setToastMessage("Regenerated Ad Copy!");
    setShowToast(true);
    // Call the regenerate callback
    if (onRegenerateCopy) {
      onRegenerateCopy();
    } else if (onRegenerate) {
      onRegenerate();
    }
  };

  // Get first letter of brand name for avatar
  const avatarLetter = brandName.charAt(0).toUpperCase();

  return (
    <div className="w-full max-w-md mx-auto relative mt-8">
      {/* Context Tag - Positioned outside the box */}
      <div className="absolute -top-10 left-4 z-10">
        <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-[#0d1117] border border-[#a855f7] text-[#a855f7]">
          {context}
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-[#0a0a0f] rounded-xl border border-[#141533] overflow-hidden">

      {/* Header Section */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start gap-3 mb-2">
          {/* Avatar */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[#6666FF] to-[#FF66FF] flex items-center justify-center">
            <span className="text-white font-bold text-lg">{avatarLetter}</span>
          </div>

          {/* Brand Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm truncate">
                  {brandName}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-zinc-400 text-xs">Sponsored</span>
                  <svg
                    className="h-3 w-3 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Menu Icon */}
              <button className="p-1 hover:bg-[#141533] rounded transition-colors">
                <svg
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            {/* Ad Copy */}
            {isEditingText ? (
              <div className="mt-2 relative flex items-start gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={editedCopy}
                    onChange={(e) => setEditedCopy(e.target.value)}
                    className="w-full min-h-[120px] px-4 py-3 rounded-lg bg-[#0a0a12] border-2 border-[#6666FF] text-white text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#6666FF]/50 focus:border-[#6666FF] resize-none shadow-lg shadow-purple-500/30"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(106, 102, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(106, 102, 255, 0.05) 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}
                    autoFocus
                    placeholder="Enter your ad copy..."
                  />
                  {/* Character Count - Bottom of textarea */}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-white">
                      {charCount} / {RECOMMENDED_CHAR_LIMIT} chars
                    </span>
                    {isOverLimit && (
                      <span className="text-xs text-orange-500 font-medium">
                        Over recommended
                      </span>
                    )}
                  </div>
                </div>
                {/* Save/Cancel Buttons - Positioned on the right side */}
                <div className="flex flex-col items-center gap-2 pt-1">
                  <button
                    onClick={handleSave}
                    className="p-1 hover:opacity-80 transition-opacity"
                    title="Save"
                  >
                    <svg
                      className="h-5 w-5 text-green-500"
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
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-1 hover:opacity-80 transition-opacity"
                    title="Cancel"
                  >
                    <svg
                      className="h-5 w-5 text-red-500"
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
              </div>
            ) : (
              <>
                {isLoadingCopy ? (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <svg
                        className="h-4 w-4 animate-spin text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="text-zinc-400">Generating brand-tailored ad copy...</span>
                    </div>
                    {/* Skeleton loader for text */}
                    <div className="space-y-2">
                      <div className="h-3 bg-[#141533] rounded animate-pulse" style={{ width: '100%' }}></div>
                      <div className="h-3 bg-[#141533] rounded animate-pulse" style={{ width: '95%' }}></div>
                      <div className="h-3 bg-[#141533] rounded animate-pulse" style={{ width: '90%' }}></div>
                      <div className="h-3 bg-[#141533] rounded animate-pulse" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p
                      onClick={handleTextClick}
                      className={`text-white text-sm mt-2 leading-relaxed ${
                        isEditingMode ? "cursor-pointer hover:bg-[#141533]/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors" : ""
                      }`}
                    >
                      {displayCopy}
                    </p>
                    {adCopy.length > 120 && !isEditingText && (
                      <button
                        onClick={() => setShowSeeMore(!showSeeMore)}
                        className="text-zinc-400 text-xs mt-1 hover:text-white transition-colors"
                      >
                        {showSeeMore ? "See less" : "See more"}
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Banner Image */}
      {banner.image && (
        <div className="relative w-full aspect-square bg-[#0d1117]">
          <img
            src={banner.image}
            alt={banner.label || `Banner ${banner.id + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Caption Section */}
      <div className="px-4 py-3 border-b border-[#141533]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-zinc-400 text-xs uppercase mb-1 truncate">
              {finalCaption.header}
            </p>
            <h4 className="text-white font-semibold text-base leading-tight">
              {finalCaption.main}
            </h4>
          </div>
          <button className="flex-shrink-0 px-4 py-1.5 rounded-lg bg-[#0d1117] border border-[#141533] text-white text-xs font-medium hover:bg-[#141533] transition-colors">
            Sign Up
          </button>
        </div>
      </div>

      {/* Social Interactions */}
      <div className="px-4 py-3 border-b border-[#141533]">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
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
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            <span className="text-sm">Like</span>
          </button>
          <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm">Comment</span>
          </button>
          <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <svg
              className="h-5 w-5"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z"/>
            </svg>
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-3 flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0d1117] border border-[#141533] text-white text-sm font-medium hover:bg-[#141533] transition-colors"
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
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy
        </button>
        <button
          onClick={handleRegenerate}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0d1117] border border-[#141533] text-white text-sm font-medium hover:border-[#6666FF] transition-colors relative group"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Regen
          <svg
            className="h-3 w-3 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#6666FF] to-[#FF66FF] text-white text-sm font-medium hover:from-[#7a5cff] hover:to-[#ff77ff] transition-all shadow-lg shadow-purple-500/20 flex-1 justify-center"
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

      {/* Toast Notification */}
      <Toast
        show={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
        duration={3000}
        position="top-right"
      />
    </div>
  );
}
