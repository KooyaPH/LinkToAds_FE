"use client";

import { useState, useEffect } from "react";

interface EditBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner: {
    id: number;
    image?: string | null;
    label?: string;
    size?: string;
    archetype?: string;
  };
  onApplyChanges?: (bannerId: number, changes: string, uploadedAssets?: { productImage?: string; logo?: string }) => void;
  productImages?: Array<{ src: string; alt: string; type?: string }>;
  isRegenerating?: boolean;
}

type TabType = "ai-edit" | "product" | "logo";

export default function EditBannerModal({
  isOpen,
  onClose,
  banner,
  onApplyChanges,
  productImages = [],
  isRegenerating = false,
}: EditBannerModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("ai-edit");
  const [changesDescription, setChangesDescription] = useState("");
  const [placementDescription, setPlacementDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploadedProductImage, setUploadedProductImage] = useState<string | null>(null);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [selectedProductImageIndex, setSelectedProductImageIndex] = useState<number | null>(null);

  // Reset error when modal opens or when regeneration completes
  useEffect(() => {
    if (isOpen) {
      setError(null);
    } else {
      // Reset uploads when modal closes
      setUploadedProductImage(null);
      setUploadedLogo(null);
      setSelectedProductImageIndex(null);
    }
  }, [isOpen, isRegenerating]);

  // Handle file upload for product image
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedProductImage(reader.result as string);
      setSelectedProductImageIndex(null); // Clear selected product image
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  // Handle file upload for logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedLogo(reader.result as string);
    };
    reader.onerror = () => {
      setError('Failed to read logo file');
    };
    reader.readAsDataURL(file);
  };

  // Handle selecting product image from available images
  const handleSelectProductImage = (index: number) => {
    setSelectedProductImageIndex(index);
    setUploadedProductImage(null); // Clear uploaded image
  };

  if (!isOpen) return null;

  const handleApply = () => {
    if (isRegenerating) {
      console.log('Already regenerating, ignoring click');
      return;
    }
    
    setError(null);
    
    const description = activeTab === "product" 
      ? placementDescription || changesDescription
      : changesDescription;
    
    // Check if user has uploaded assets or provided description
    const hasUploadedProductImage = uploadedProductImage || selectedProductImageIndex !== null;
    const hasUploadedLogo = uploadedLogo !== null;
    const hasDescription = description.trim().length > 0;
    
    // For product tab: require either uploaded image or description
    // For logo tab: require either uploaded logo or description
    // For ai-edit tab: require description
    if (activeTab === "product" && !hasUploadedProductImage && !hasDescription) {
      setError("Please upload a product image or describe your changes.");
      return;
    }
    
    if (activeTab === "logo" && !hasUploadedLogo && !hasDescription) {
      setError("Please upload a logo or describe your changes.");
      return;
    }
    
    if (activeTab === "ai-edit" && !hasDescription) {
      setError("Please describe your changes before applying.");
      return;
    }
    
    console.log('Apply Changes clicked:', {
      activeTab,
      description: description.substring(0, 50),
      hasUploadedProductImage,
      hasUploadedLogo,
      hasOnApplyChanges: !!onApplyChanges,
    });
    
    if (onApplyChanges) {
      // Get banner ID - handle both numeric and string IDs, and handle 0 as valid
      const bannerId = banner?.id;
      const numericId = typeof bannerId === 'string' ? parseInt(bannerId, 10) : bannerId;
      
      console.log('Calling onApplyChanges with banner ID and description', {
        bannerId,
        numericId,
        banner,
        description: description.substring(0, 50),
        bannerIdType: typeof bannerId,
      });
      
      // Check if ID is valid (0 is valid, but undefined/null/NaN are not)
      if (numericId === undefined || numericId === null || isNaN(numericId)) {
        console.error('Banner ID is invalid:', { bannerId, numericId, banner });
        setError("Invalid banner ID. Please try again.");
        return;
      }
      
      // Prepare uploaded assets
      const uploadedAssets: { productImage?: string; logo?: string } = {};
      
      // Use uploaded product image or selected product image (only for product tab)
      if (activeTab === "product") {
        if (uploadedProductImage) {
          uploadedAssets.productImage = uploadedProductImage;
        } else if (selectedProductImageIndex !== null && productImages[selectedProductImageIndex]) {
          uploadedAssets.productImage = productImages[selectedProductImageIndex].src;
        }
      }
      
      // Use uploaded logo (only for logo tab)
      if (activeTab === "logo" && uploadedLogo) {
        uploadedAssets.logo = uploadedLogo;
      }
      
      // Use description or default message if assets are uploaded
      const finalDescription = description.trim() || 
        (hasUploadedProductImage || hasUploadedLogo 
          ? "Apply the uploaded assets to the banner" 
          : "");
      
      onApplyChanges(numericId, finalDescription, Object.keys(uploadedAssets).length > 0 ? uploadedAssets : undefined);
    } else {
      console.error('onApplyChanges is not provided!');
      setError("Cannot apply changes. Please try again.");
    }
    // Don't close modal or reset state here - let parent handle it after regeneration
  };

  const handleCancel = () => {
    if (isRegenerating) return;
    
    setChangesDescription("");
    setPlacementDescription("");
    setUploadedProductImage(null);
    setUploadedLogo(null);
    setSelectedProductImageIndex(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#0a0a0f] rounded-2xl border border-[#141533] shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#141533]">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-white"
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
            <h2 className="text-lg font-semibold text-white">Edit Banner</h2>
          </div>
          <button
            onClick={handleCancel}
            className="p-1 rounded-lg hover:bg-[#141533] transition-colors"
          >
            <svg
              className="h-6 w-6 text-white"
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Banner Preview */}
          {banner.image && (
            <div className="mb-4 rounded-xl overflow-hidden border border-[#141533] bg-[#0d1117]">
              <div className="relative aspect-square max-h-[300px] mx-auto">
                <img
                  src={banner.image}
                  alt={banner.label || `Banner ${banner.id + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Example CTA overlay */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-zinc-800/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
                    <span className="text-white text-xs font-medium">Tap to Plan</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="rounded-lg border border-[#141533] bg-[#0d1117] p-1 mb-4 flex">
            <button
              onClick={() => setActiveTab("ai-edit")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "ai-edit"
                  ? "bg-[#0a0a0f] text-white"
                  : "bg-transparent text-zinc-300 hover:text-white"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
              </svg>
              AI Edit
            </button>
            <button
              onClick={() => setActiveTab("product")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "product"
                  ? "bg-[#0a0a0f] text-white"
                  : "bg-transparent text-zinc-300 hover:text-white"
              }`}
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
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Product
            </button>
            <button
              onClick={() => setActiveTab("logo")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "logo"
                  ? "bg-[#0a0a0f] text-white"
                  : "bg-transparent text-zinc-300 hover:text-white"
              }`}
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Logo
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "ai-edit" && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Describe your changes
              </label>
              <textarea
                value={changesDescription}
                onChange={(e) => {
                  setChangesDescription(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., Change headline, make CTA larger..."
                rows={3}
                className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#6666FF] transition-colors resize-none"
              />
              <p className="mt-2 text-xs text-zinc-400">
                Be specific about text, colors, or layout changes.
              </p>
              {error && (
                <p className="mt-2 text-xs text-red-400">{error}</p>
              )}
            </div>
          )}

          {activeTab === "product" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white mb-3">
                  Add or Replace Product Photo
                </h3>
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#141533] bg-[#0d1117] text-white text-sm font-medium hover:bg-[#141533] transition-colors cursor-pointer inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="hidden"
                    disabled={isRegenerating}
                  />
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload Photo
                </label>
                
                {/* Show uploaded product image preview */}
                {uploadedProductImage && (
                  <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border border-[#6666FF] bg-[#0d1117]">
                    <img
                      src={uploadedProductImage}
                      alt="Uploaded product"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setUploadedProductImage(null)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 rounded-full p-1 transition-colors"
                      disabled={isRegenerating}
                    >
                      <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {productImages.length > 0 && (
                <div>
                  <p className="text-sm text-zinc-400 mb-3">
                    Or select from available:
                  </p>
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {productImages.slice(0, 4).map((img, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectProductImage(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border bg-[#0d1117] cursor-pointer hover:border-[#6666FF] transition-colors group ${
                          selectedProductImageIndex === index ? 'border-[#6666FF] border-2' : 'border-white/20'
                        }`}
                      >
                        <img
                          src={img.src}
                          alt={img.alt || `Product ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {selectedProductImageIndex === index && (
                          <div className="absolute inset-0 bg-[#6666FF]/30 flex items-center justify-center">
                            <div className="bg-[#6666FF] rounded-full p-1">
                              <svg
                                className="h-3 w-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                        {selectedProductImageIndex !== index && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="bg-[#6666FF] rounded-full p-1">
                              <svg
                                className="h-3 w-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <textarea
                  value={placementDescription}
                  onChange={(e) => setPlacementDescription(e.target.value)}
                  placeholder="Optional: Describe placement..."
                  rows={3}
                  className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#6666FF] transition-colors resize-y"
                />
              </div>
            </div>
          )}

          {activeTab === "logo" && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Add or Replace Logo
              </label>
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#141533] bg-[#0d1117] text-white text-sm font-medium hover:bg-[#141533] transition-colors mb-4 cursor-pointer inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={isRegenerating}
                />
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload Logo
              </label>
              
              {/* Show uploaded logo preview */}
              {uploadedLogo && (
                <div className="mb-4 relative w-32 h-32 rounded-lg overflow-hidden border border-[#6666FF] bg-[#0d1117] flex items-center justify-center">
                  <img
                    src={uploadedLogo}
                    alt="Uploaded logo"
                    className="max-w-full max-h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setUploadedLogo(null)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 rounded-full p-1 transition-colors"
                    disabled={isRegenerating}
                  >
                    <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              <textarea
                value={changesDescription}
                onChange={(e) => setChangesDescription(e.target.value)}
                placeholder="Optional: Describe logo placement..."
                rows={3}
                className="w-full rounded-lg border border-[#141533] bg-[#0a0a12] px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#6666FF] transition-colors resize-y"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3 border-t border-[#141533]">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg bg-[#0d1117] text-white text-sm font-medium hover:bg-[#141533] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={isRegenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6666FF] to-[#FF66FF] text-white text-sm font-medium hover:from-[#7a5cff] hover:to-[#ff77ff] transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRegenerating ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Regenerating...
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
                Apply Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
