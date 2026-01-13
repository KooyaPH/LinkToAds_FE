"use client";

import { useState, useEffect } from "react";
import EditBannerModal from "./EditBannerModal";

interface BannerGridProps {
  selectedBanners: number[];
  onBannerToggle: (index: number) => void;
  banners?: Array<{ id: number; image?: string | null; label?: string; error?: string; size?: string }>;
  isGenerating?: boolean;
}

export default function BannerGrid({
  selectedBanners,
  onBannerToggle,
  banners = [],
  isGenerating = false,
}: BannerGridProps) {
  const [editingBanner, setEditingBanner] = useState<number | null>(null);
  const [productImages, setProductImages] = useState<Array<{ src: string; alt: string; type?: string }>>([]);

  // Load product images from localStorage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('extractedData');
      if (storedData) {
        const data = JSON.parse(storedData);
        if (data.images && Array.isArray(data.images)) {
          // Filter for product images or use all images
          const images = data.images
            .filter((img: { type?: string }) => !img.type || img.type === 'product' || img.type === 'image')
            .map((img: { src: string; alt: string; type?: string }) => ({
              src: img.src,
              alt: img.alt || 'Product image',
              type: img.type,
            }));
          setProductImages(images);
        }
      }
    } catch (error) {
      console.error('Error loading product images:', error);
    }
  }, []);

  const handleEditClick = (bannerId: number) => {
    setEditingBanner(bannerId);
  };

  const handleCloseModal = () => {
    setEditingBanner(null);
  };

  const handleApplyChanges = (changes: string) => {
    // Handle apply changes logic here
    console.log("Applying changes to banner", editingBanner, ":", changes);
    // You can add API call or state update here
  };

  const currentBanner = editingBanner !== null 
    ? banners.find(b => b.id === editingBanner) 
    : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-start">
          {banners.map((banner) => {
            // Apply correct aspect ratio based on banner size
            const aspectClass =
              banner.size === 'portrait' ? 'aspect-[1080/1350]' :
                banner.size === 'story' ? 'aspect-[9/16]' :
                  banner.size === 'landscape' ? 'aspect-[1200/628]' :
                    'aspect-square';

            const isSelected = selectedBanners.includes(banner.id);
            
            return (
              <div
                key={banner.id}
                onClick={() => !isGenerating && banner.image && onBannerToggle(banner.id)}
                className={`relative rounded-xl border overflow-hidden cursor-pointer group transition-all w-full ${aspectClass} ${
                  isSelected
                    ? "border-[#6666FF] border-2 shadow-[0_0_0_4px_rgba(102,102,255,0.2),0_0_20px_rgba(102,102,255,0.3)]"
                    : "border-[#1a1a22]"
                  } ${isGenerating || !banner.image ? "cursor-wait" : ""} bg-[#0d1117]`}
              >
                {banner.image ? (
                  <>
                    <img
                      src={banner.image}
                      alt={banner.label || `Banner ${banner.id + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Violet tint overlay when selected */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#6666FF]/20 pointer-events-none" />
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex flex-col items-center justify-center">
                    {isGenerating ? (
                      <>
                        <svg className="h-8 w-8 animate-spin text-[#6a4cff] mb-3" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-zinc-400 text-sm">Generating...</span>
                      </>
                    ) : banner.error ? (
                      <>
                        <svg className="h-8 w-8 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-red-400 text-xs text-center px-4">
                          {banner.error}
                        </span>
                      </>
                    ) : (
                      <span className="text-zinc-500 text-sm">
                        {banner.label || `Banner Image ${banner.id + 1}`}
                      </span>
                    )}
                  </div>
                )}
                {/* Selection indicator - Top right checkmark badge */}
                {banner.image && isSelected && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-gradient-to-r from-[#6666FF] to-[#FF66FF] rounded-full p-2 shadow-lg ring-2 ring-white/20">
                      <svg className="h-5 w-5 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Edit button - appears on hover */}
                {banner.image && (
                  <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(banner.id);
                      }}
                      className="flex items-center gap-1.5 rounded-full bg-[#0a0a12]/90 backdrop-blur-sm border border-zinc-700/50 px-3 py-1.5 text-white text-sm font-medium hover:bg-[#12121a] transition-colors shadow-lg"
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <span>Edit</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Edit Banner Modal */}
      {currentBanner && (
        <EditBannerModal
          isOpen={editingBanner !== null}
          onClose={handleCloseModal}
          banner={currentBanner}
          onApplyChanges={handleApplyChanges}
          productImages={productImages}
        />
      )}
    </>
  );
}
