"use client";

import { useState } from "react";
import Image from "next/image";
import Toast from "@/components/Toast";

export interface Ad {
  id: string;
  title: string;
  content: string;
  image_url: string;
  platform: string;
  status: string;
  created_at: string;
}

interface ProjectAdCardProps {
  ad: Ad;
  onView: (ad: Ad) => void;
  onDownload: (ad: Ad) => void;
  onDelete?: (ad: Ad) => void;
  formatDate: (date: string) => string;
  isDeleting?: boolean;
  brandName?: string;
}

export default function ProjectAdCard({
  ad,
  onView,
  onDownload,
  onDelete,
  formatDate,
  isDeleting = false,
  brandName = "Your Brand",
}: ProjectAdCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  // Get first letter of brand name for avatar
  const avatarLetter = brandName.charAt(0).toUpperCase();

  // Truncate content for display
  const displayContent = showFullContent
    ? ad.content
    : ad.content.length > 120
    ? ad.content.substring(0, 120) + "..."
    : ad.content;

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(ad.content);
    setShowToast(true);
    setShowCheckmark(true);
    
    // Switch back to copy icon after 2 seconds
    setTimeout(() => {
      setShowCheckmark(false);
    }, 2000);
  };


  // Handle download image
  const handleDownloadImage = async () => {
    try {
      const response = await fetch(ad.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${ad.title || 'ad'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative mb-12">
    
      {/* Copy Icon - Outside and top left */}
      <button
        onClick={handleCopy}
        className="absolute -top-6 right-10 p-1 hover:bg-[#141533] rounded-lg transition-all duration-300 cursor-pointer"
        title="Copy caption"
      >
        {showCheckmark ? (
          <div className="bg-[#0a0a0f] rounded-lg border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] p-1 transition-all duration-300 flex items-center justify-center w-6 h-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 0 24 24"
              width="18px"
              fill="#22c55e"
              className="transition-all duration-300"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e3e3e3"
            className="hover:fill-white transition-colors"
          >
            <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
          </svg>
        )}
      </button>
      {/* Download Icon - Outside and top right */}
      <button
        onClick={handleDownloadImage}
        className="absolute -top-6 right-0 p-1 hover:bg-[#141533] rounded-lg transition-colors cursor-pointer"
        title="Download image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e3e3e3"
          className="hover:fill-white transition-colors"
        >
          <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
        </svg>
      </button>
      {/* Main Card */}
      <div className="bg-[#0a0a0f] rounded-xl border border-[#141533] overflow-hidden mt-4 mb-8">

      <div>
        
      </div>

        {/* Header Section */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start gap-3 mb-2">
            {/* Avatar */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#6666FF] to-[#FF66FF] flex items-center justify-center">
              <span className="text-white font-bold text-sm">{avatarLetter}</span>
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
                    <span className="text-zinc-400 text-xs">·</span>
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
              {ad.content && (
                <div className="mt-2">
                  <p className="text-white text-sm leading-relaxed">
                    {displayContent}
                  </p>
                  {ad.content.length > 120 && (
                    <button
                      onClick={() => setShowFullContent(!showFullContent)}
                      className="text-zinc-400 text-xs mt-1 hover:text-white transition-colors"
                    >
                      {showFullContent ? "See less" : "See more"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banner Image */}
        <div
          className="relative w-full aspect-square bg-[#0d1117] cursor-pointer"
          onClick={() => onView(ad)}
        >
          <Image
            src={ad.image_url}
            alt={ad.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Caption Section */}
        <div className="px-4 py-3 border-b border-[#141533]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-zinc-400 text-xs uppercase mb-1 truncate">
                {ad.title.toUpperCase().substring(0, 30)}...
              </p>
              <h4 className="text-white font-semibold text-sm leading-tight line-clamp-2">
                {ad.title}
              </h4>
            </div>
            <button className="flex-shrink-0 px-4 py-1.5 rounded-lg bg-[#0d1117] border border-[#141533] text-white text-xs font-medium hover:bg-[#141533] transition-colors">
              Shop Now
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
                <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
              </svg>
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-3 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0d1117] border border-[#141533] text-white text-sm font-medium hover:bg-[#141533] transition-colors"
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
            onClick={() => onDownload(ad)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6666FF] to-[#FF66FF] text-white text-sm font-medium hover:from-[#7a5cff] hover:to-[#ff77ff] transition-all shadow-lg shadow-purple-500/20"
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
        message="Ad text copied!"
        onClose={() => setShowToast(false)}
        duration={3000}
        position="top-right"
      />
    </div>
  );
}
