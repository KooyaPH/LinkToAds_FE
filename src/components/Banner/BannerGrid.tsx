interface BannerGridProps {
  selectedBanners: number[];
  onBannerToggle: (index: number) => void;
  banners?: Array<{ id: number; image?: string; label?: string }>;
}

export default function BannerGrid({
  selectedBanners,
  onBannerToggle,
  banners = [
    { id: 0, label: "Banner Image 1" },
    { id: 1, label: "Banner Image 2" },
    { id: 2, label: "Banner Image 3" },
  ],
}: BannerGridProps) {
  return (
    <section className="flex-1 px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
          {banners.map((banner) => (
            <div
              key={banner.id}
              onClick={() => onBannerToggle(banner.id)}
              className={`relative rounded-xl border overflow-hidden cursor-pointer group transition-all aspect-square w-full ${
                selectedBanners.includes(banner.id)
                  ? "border-[#6666FF] ring-2 ring-[#6666FF]/50"
                  : "border-[#1a1a22]"
              } bg-[#0d1117]`}
            >
              <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                <span className="text-zinc-500 text-sm">
                  {banner.label || `Banner Image ${banner.id + 1}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
