interface BannerGridProps {
  selectedBanners: number[];
  onBannerToggle: (index: number) => void;
  banners?: Array<{ id: number; image?: string | null; label?: string; error?: string }>;
  isGenerating?: boolean;
}

export default function BannerGrid({
  selectedBanners,
  onBannerToggle,
  banners = [
    { id: 0, label: "Banner Image 1" },
    { id: 1, label: "Banner Image 2" },
    { id: 2, label: "Banner Image 3" },
  ],
  isGenerating = false,
}: BannerGridProps) {
  return (
    <section className="flex-1 px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
          {banners.map((banner) => (
            <div
              key={banner.id}
              onClick={() => !isGenerating && banner.image && onBannerToggle(banner.id)}
              className={`relative rounded-xl border overflow-hidden cursor-pointer group transition-all aspect-square w-full ${selectedBanners.includes(banner.id)
                  ? "border-[#6666FF] ring-2 ring-[#6666FF]/50"
                  : "border-[#1a1a22]"
                } ${isGenerating || !banner.image ? "cursor-wait" : ""} bg-[#0d1117]`}
            >
              {banner.image ? (
                <img
                  src={banner.image}
                  alt={banner.label || `Banner ${banner.id + 1}`}
                  className="w-full h-full object-cover"
                />
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
              {/* Selection overlay */}
              {banner.image && selectedBanners.includes(banner.id) && (
                <div className="absolute inset-0 bg-[#6666FF]/20 flex items-center justify-center">
                  <div className="bg-[#6666FF] rounded-full p-2">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

