"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { steps, archetypeCategories } from "@/lib/generateConstants";
import PlanCard from "@/components/PlanCard";
import AdCard from "@/components/AdCard";
import { api } from "@/lib/api";
import { loadBanners } from "@/lib/bannerStorage";

interface Banner {
  id: number;
  image?: string | null;
  label?: string;
  error?: string;
  size?: string;
  archetype?: string;
}

interface ExtractedData {
  url?: string;
  productInfo?: {
    productName?: string;
    industry?: string;
    tagline?: string;
  };
  aiInsights?: {
    businessDescription?: string;
    uniqueSellingProposition?: string;
    targetAudience?: string;
    currentOffer?: string;
    brandToneAndVoice?: string;
    businessType?: string;
    brandColorPalette?: string[];
  };
  ctas?: string[];
  keyFeatures?: string[];
}

export default function ResultsPage() {
  const router = useRouter();
  const currentStep = 4; // Step 4 (Results)
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedBanners, setSelectedBanners] = useState<number[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isEditingCopy, setIsEditingCopy] = useState(false);
  const [editedAdCopies, setEditedAdCopies] = useState<{ [key: number]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const planData = {
    plan: "Pro",
    adsThisMonth: 12,
    limit: 200,
  };

  // Generate caption based on extracted data and banner index
  const generateCaption = (banner: Banner, index: number) => {
    if (!extractedData) {
      return {
        header: "DISCOVER AMAZING PRODUCTS AND SERVICES",
        main: "Transform Your Life Today!",
      };
    }

    const productName = extractedData.productInfo?.productName || "Our Product";
    const usp = extractedData.aiInsights?.uniqueSellingProposition || "";
    const features = extractedData.keyFeatures || [];
    const ctas = extractedData.ctas || [];

    // Generate header (truncated USP or feature)
    const headerOptions = [
      usp ? usp.substring(0, 40).toUpperCase() + "..." : "",
      features[0] ? features[0].substring(0, 40).toUpperCase() + "..." : "",
      "ENSURE YOUR LOVED ONES ARE COVERED...",
      "DISCOVER THE PERFECT SOLUTION FOR YOU...",
    ].filter(Boolean);

    // Generate main caption
    const mainOptions = [
      ctas[0] || `Get Started with ${productName} Today!`,
      `Experience ${productName} - ${usp.substring(0, 50)}`,
      `Peace of Mind? Secure Your Family's Future Easily!`,
      `Transform Your Life with ${productName}!`,
      features[0] ? `${features[0]} - Start Now!` : `Discover ${productName} Today!`,
    ].filter(Boolean);

    // Use index to vary captions
    const headerIndex = index % headerOptions.length;
    const mainIndex = index % mainOptions.length;

    return {
      header: headerOptions[headerIndex] || "DISCOVER AMAZING PRODUCTS",
      main: mainOptions[mainIndex] || "Transform Your Life Today!",
    };
  };

  // Generate context label based on archetype from banner
  const generateContext = (banner: Banner, index: number) => {
    const archetypeId = banner.archetype || "";
    
    // Find the archetype in the categories and get its category name
    if (archetypeId) {
      for (const category of archetypeCategories) {
        const foundArchetype = category.archetypes.find(a => a.id === archetypeId);
        if (foundArchetype) {
          // Map category names to context labels
          const categoryContextMap: { [key: string]: string } = {
            "NATIVE/ORGANIC": "Native Context",
            "SOCIAL PROOF": "Social Proof Context",
            "URGENCY/SALES": "Urgency Context",
            "EDUCATIONAL": "Educational Context",
            "PRODUCT FOCUS": "Product Context",
          };
          
          return categoryContextMap[category.name] || `${category.name} Context`;
        }
      }
    }
    
    // Fallback: if no archetype found, use index-based selection
    const contexts = [
      "Lifestyle Context",
      "Product Context",
      "Social Proof Context",
      "Educational Context",
      "Urgency Context",
      "Native Context",
    ];
    
    return contexts[index % contexts.length];
  };

  // Generate ad copy
  const generateAdCopy = (banner: Banner, index: number) => {
    // Return edited copy if it exists
    if (editedAdCopies[banner.id]) {
      return editedAdCopies[banner.id];
    }

    if (!extractedData) {
      return "Discover our amazing products and services designed to help you achieve your goals. Join thousands of satisfied customers today.";
    }

    const productName = extractedData.productInfo?.productName || "our product";
    const description = extractedData.aiInsights?.businessDescription || "";
    const usp = extractedData.aiInsights?.uniqueSellingProposition || "";
    const targetAudience = extractedData.aiInsights?.targetAudience || "";

    const copyOptions = [
      `Imagine a future where ${targetAudience ? targetAudience.toLowerCase() : "you"} don't have to worry about ${productName.toLowerCase()}. ${productName} helps you ${usp.toLowerCase() || "achieve your goals"} with ease and confidence.`,
      `Discover ${productName} - ${description.substring(0, 100)}${description.length > 100 ? "..." : ""}`,
      `Looking for ${productName.toLowerCase()}? ${productName} offers ${usp.toLowerCase() || "premium quality"} designed specifically for ${targetAudience.toLowerCase() || "you"}. Experience the difference today.`,
      `Transform your life with ${productName}. ${usp || "Our innovative solution"} helps ${targetAudience.toLowerCase() || "you"} achieve ${productName.toLowerCase()} goals faster and easier than ever before.`,
    ];

    return copyOptions[index % copyOptions.length];
  };

  // Load banners and extracted data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      const loadedBanners = await loadBanners();
      if (loadedBanners && loadedBanners.length > 0) {
        setBanners(loadedBanners.filter((b: Banner) => b.image));
      }

      const storedSelected = localStorage.getItem('selectedBannerIds');
      if (storedSelected) {
        setSelectedBanners(JSON.parse(storedSelected));
      }

      // Load extracted data for generating captions
      const storedExtractedData = localStorage.getItem('extractedData');
      if (storedExtractedData) {
        try {
          const parsed = JSON.parse(storedExtractedData);
          setExtractedData(parsed);
        } catch (e) {
          console.error('Failed to parse extracted data:', e);
        }
      }
    };
    
    loadData();
  }, []);

  const successfulBanners = banners.filter(b => b.image);
  const bannerCount = successfulBanners.length || parseInt(localStorage.getItem('requestedAdsCount') || '3', 10);
  
  // Get brand name from extracted data
  const brandName = extractedData?.productInfo?.productName || "Your Brand";

  // Handle actions
  const handleCopy = (bannerId: number) => {
    // Copy banner image or data to clipboard
    console.log('Copy banner:', bannerId);
    // TODO: Implement copy functionality
  };

  const handleRegenerate = (bannerId: number) => {
    // Navigate to banners page for regeneration
    router.push('/dashboard/generate/banners');
  };

  const handleDownload = (banner: Banner) => {
    if (!banner.image) return;
    
    // Create a temporary anchor element to download the image
    const link = document.createElement('a');
    link.href = banner.image;
    link.download = `banner-${banner.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save campaign via Backend API
  const handleSaveCampaign = async () => {
    if (successfulBanners.length === 0) {
      setSaveStatus({ type: 'error', message: 'No banners to save' });
      return;
    }

    // Check if user is authenticated
    if (!api.isAuthenticated()) {
      setSaveStatus({ type: 'error', message: 'Please log in to save your campaign' });
      return;
    }

    setIsSaving(true);
    setSaveStatus({ type: null, message: '' });

    try {
      // Prepare ads data with images and captions
      const adsToSave = successfulBanners.map((banner, index) => ({
        image: banner.image!,
        caption: generateAdCopy(banner, index),
        title: `${brandName} - Ad ${index + 1}`,
      }));

      // Save campaign via backend API with project info and strategy analysis
      const result = await api.saveCampaign(adsToSave, {
        name: brandName,
        url: extractedData?.url,
        strategyAnalysis: {
          usp: extractedData?.aiInsights?.uniqueSellingProposition,
          targetAudience: extractedData?.aiInsights?.targetAudience,
          currentOffer: extractedData?.aiInsights?.currentOffer || extractedData?.ctas?.join(', '),
          brandTone: extractedData?.aiInsights?.brandToneAndVoice,
        },
      });

      if (result.success && result.data) {
        setSaveStatus({ 
          type: 'success', 
          message: `Successfully saved ${result.data.savedCount} ad${result.data.savedCount > 1 ? 's' : ''} to your campaign! Redirecting...` 
        });
        // Redirect to projects page after a brief delay
        setTimeout(() => {
          router.push('/dashboard/projects');
        }, 1500);
      } else {
        setSaveStatus({ 
          type: 'error', 
          message: result.message || 'Failed to save campaign' 
        });
      }
    } catch (error) {
      console.error('Save campaign error:', error);
      setSaveStatus({ type: 'error', message: 'An error occurred while saving' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <header className="flex h-[73px] items-center border-b border-[#141533] px-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-white hover:text-zinc-400 transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Overview
        </Link>
      </header>

      <main className="relative flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-16 lg:py-12">
        <PlanCard
          plan={planData.plan}
          adsThisMonth={planData.adsThisMonth}
          limit={planData.limit}
        />

        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-0 mb-8 sm:mb-12 lg:mb-16 mt-8 sm:mt-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all ${step.number <= currentStep
                    ? "bg-gradient-to-r from-[#6666FF] to-[#FF66FF] text-white"
                    : "border border-[#141533] bg-[#0d1117] text-zinc-400"
                    }`}
                >
                  {step.number}
                </div>
                <span
                  className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium hidden sm:block ${step.number <= currentStep
                    ? "text-white"
                    : "text-zinc-500"
                    }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-[2px] w-6 sm:w-12 lg:w-16 mx-1 sm:mx-2 sm:mt-[-20px] ${step.number < currentStep
                    ? "bg-gradient-to-r from-[#6666FF] to-[#FF66FF]"
                    : "bg-[#1a1a22]"
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Results Section */}
        <section className="flex flex-col items-center px-2 sm:px-0">
          {/* Icon */}
          <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#6666FF] to-[#FF66FF] shadow-lg shadow-purple-500/40">
            <svg
              className="h-6 w-6 sm:h-7 sm:w-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="mb-2 sm:mb-3 text-2xl sm:text-3xl font-bold text-white text-center">
            Your Ads Are Ready!
          </h1>

          {/* Descriptive Text */}
          <p className="text-zinc-400 text-sm sm:text-base text-center mb-8">
            {bannerCount} high-converting ad variations.
          </p>

          {/* Edit Copy Button */}
          <button
            onClick={() => setIsEditingCopy(!isEditingCopy)}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
              isEditingCopy
                ? "bg-[#6666FF] text-white shadow-lg shadow-purple-500/20"
                : "border border-zinc-700/50 bg-[#0d1117] text-white hover:border-zinc-600 hover:bg-[#12121a]"
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            {isEditingCopy ? "Editing On" : "Edit Copy"}
          </button>
        </section>

        {/* Ad Cards Grid */}
        {successfulBanners.length > 0 && (
          <div className="max-w-7xl mx-auto mt-12 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {successfulBanners.map((banner, index) => (
                <AdCard
                  key={banner.id}
                  banner={banner}
                  brandName={brandName}
                  adCopy={generateAdCopy(banner, index)}
                  context={generateContext(banner, index)}
                  caption={generateCaption(banner, index)}
                  onCopy={() => handleCopy(banner.id)}
                  onRegenerate={() => handleRegenerate(banner.id)}
                  onDownload={() => handleDownload(banner)}
                  isEditingMode={isEditingCopy}
                  onAdCopyChange={(bannerId, newCopy) => {
                    // Store the edited ad copy
                    setEditedAdCopies((prev) => ({
                      ...prev,
                      [bannerId]: newCopy,
                    }));
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="w-full max-w-7xl mx-auto px-8 mt-12 pb-12 flex items-center justify-center gap-4">
          {/* Generate New Ads Button */}
          <button
            onClick={() => router.push('/dashboard/generate')}
            className="flex items-center gap-2 rounded-lg border border-[#141533] bg-[#0d1117] px-6 py-3 text-white text-sm font-medium transition-all hover:border-[#6666FF] hover:bg-[#12121a]"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Generate New Ads</span>
          </button>

          {/* Save Campaign Button */}
          <button
            onClick={handleSaveCampaign}
            disabled={isSaving}
            className={`flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6666FF] to-[#FF66FF] px-6 py-3 text-white text-sm font-medium transition-all shadow-lg shadow-purple-500/20 ${
              isSaving 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:from-[#7a5cff] hover:to-[#ff77ff]'
            }`}
          >
            {isSaving ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
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
                <span>Saving...</span>
              </>
            ) : (
              <>
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>Save Campaign</span>
              </>
            )}
          </button>

          {/* Download All Button */}
          <button
            onClick={() => {
              // Download all banners
              successfulBanners.forEach((banner) => {
                if (banner.image) {
                  const link = document.createElement('a');
                  link.href = banner.image;
                  link.download = `banner-${banner.id}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              });
            }}
            className="flex items-center gap-2 rounded-lg border border-[#141533] bg-[#0d1117] px-6 py-3 text-white text-sm font-medium transition-all hover:border-[#6666FF] hover:bg-[#12121a]"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Download All</span>
          </button>
        </div>

        {/* Save Status Message */}
        {saveStatus.type && (
          <div className="w-full max-w-7xl mx-auto px-8 pb-8">
            <div
              className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                saveStatus.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}
            >
              {saveStatus.type === 'success' ? (
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-sm">{saveStatus.message}</span>
              <button
                onClick={() => setSaveStatus({ type: null, message: '' })}
                className="ml-auto text-current hover:opacity-70 transition-opacity"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
