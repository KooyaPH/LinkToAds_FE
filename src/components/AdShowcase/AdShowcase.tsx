"use client";

const adCategories = [
  { label: "Native", color: "bg-green-500" },
  { label: "Social Proof", color: "bg-blue-500" },
  { label: "Urgency", color: "bg-orange-500" },
  { label: "Educational", color: "bg-teal-500" },
  { label: "Product", color: "bg-pink-500" },
];

const adPreviews = [
  { id: 1, image: "/banner/banner-1.png", alt: "Native Ad", category: "Native" },
  {
    id: 2,
    image: "/banner/banner-2.png",
    alt: "Social Proof Ad",
    category: "Social Proof",
  },
  {
    id: 3,
    image: "/banner/banner-3.png",
    alt: "Urgency Ad",
    category: "Urgency",
  },
  {
    id: 4,
    image: "/banner/banner-4.png",
    alt: "Educational Ad",
    category: "Educational",
  },
  {
    id: 5,
    image: "/banner/banner-5.png",
    alt: "Product Ad",
    category: "Product",
  },
];

export default function AdShowcase() {
  return (
    <section className="flex flex-col items-center px-6 py-12">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#10122c] px-5 py-2">
        <span className="text-sm font-medium text-[#6348f0]">
          20 Ad Archetypes • Proven to Convert
        </span>
      </div>

      {/* Browser Mockup */}
      <div className="w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-[#0d0d1a] shadow-2xl">
        {/* Browser Header */}
        <div className="flex items-center gap-4 border-b border-white/10 bg-[#12121f] px-4 py-3">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>

          {/* URL Bar */}
          <div className="flex flex-1 items-center rounded-lg bg-[#1a1a2e] px-4 py-2">
            <span className="text-sm text-zinc-400">https://yourbusiness.com</span>
          </div>
        </div>

        {/* Ad Previews */}
        <div className="overflow-hidden p-4 md:p-5">
          {/* Auto-scrolling on mobile, static flex on desktop */}
          <div className="animate-marquee-slow flex w-max gap-3 md:w-full md:animate-none md:justify-center md:gap-4">
            {/* Duplicate for seamless loop on mobile */}
            {[...adPreviews, ...adPreviews].map((ad, index) => {
              const category = adCategories.find(
                (cat) => cat.label === ad.category,
              );
              const isOriginal = index < adPreviews.length;

              return (
                <div
                  key={`${ad.id}-${index}`}
                  className={`group relative aspect-[4/5] w-32 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all hover:scale-105 md:w-40 lg:w-44 ${
                    isOriginal && index === adPreviews.length - 1
                      ? "border-red-500 shadow-lg shadow-red-500/30"
                      : "border-transparent"
                  } ${!isOriginal ? "md:hidden" : ""}`}
                >
                  <img
                    src={ad.image}
                    alt={ad.alt}
                    className="h-full w-full object-cover"
                  />

                  {/* Top-left category tag */}
                  <div
                    className={`pointer-events-none absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 md:px-2.5 md:py-1 md:text-xs ${
                      category?.color ?? "bg-zinc-700"
                    }`}
                  >
                    {category?.label ?? ad.category}
                  </div>

                  {/* Bottom label tag */}
                  <div className="pointer-events-none absolute inset-x-1 bottom-1 flex justify-center opacity-0 transition-opacity group-hover:opacity-100 md:inset-x-2 md:bottom-2">
                    <span className="rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-white shadow-lg md:px-3 md:py-1 md:text-xs">
                      {ad.alt}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Labels */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
        {adCategories.map((category) => (
          <div key={category.label} className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${category.color}`} />
            <span className="text-sm text-zinc-400">{category.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

