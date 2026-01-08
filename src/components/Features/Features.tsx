"use client";

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    title: "Smart Website Scraping",
    description: "Auto-extract logos, images, brand colors, and key messaging from any URL in seconds.",
    tag: "Just paste a link",
    iconBg: "bg-[#2b1b4b]",
    iconColor: "text-[#6a4cff]",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: "20 Proven Archetypes",
    description: "Choose from social proof, urgency, educational, native, and service-focused ad templates.",
    tag: "Tested formulas",
    iconBg: "bg-[#2b1b4b]",
    iconColor: "text-[#6a4cff]",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    title: "AI Copywriting",
    description: "Generate scroll-stopping headlines and primary text optimized for Facebook's algorithm.",
    tag: "Click-worthy copy",
    iconBg: "bg-[#2b1b4b]",
    iconColor: "text-[#6a4cff]",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "1-Click Regeneration",
    description: "Regenerate copy per ad with short, medium, or long options. Perfect your message instantly.",
    tag: "Unlimited variations",
    iconBg: "bg-[#2b1b4b]",
    iconColor: "text-[#6a4cff]",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    title: "4 Banner Sizes",
    description: "1:1 Square, 4:5 Portrait, 9:16 Story, and 16:9 Landscape - all platform-optimized.",
    tag: "Every placement",
    iconBg: "bg-[#2b1b4b]",
    iconColor: "text-[#6a4cff]",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Custom Asset Upload",
    description: "Use your own logo and photos for fully personalized banner creatives.",
    tag: "Your brand, your way",
    iconBg: "bg-[#2b1b4b]",
    iconColor: "text-[#6a4cff]",
  },
];

export default function Features() {
  return (
    <section className="flex flex-col items-center px-6 py-20">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
        <span className="text-sm">✨</span>
        <span className="text-sm font-medium text-zinc-300">Powerful Features</span>
      </div>

      {/* Headline */}
      <h2 className="max-w-3xl text-center text-2xl font-bold text-white md:text-3xl lg:text-4xl">
        Everything You Need to{" "}
        <span className="bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
          Create Winning Ads
        </span>
      </h2>

      {/* Subheadline */}
      <p className="mt-4 max-w-2xl text-center text-zinc-400">
        From website scraping to banner generation, our AI handles the entire creative process so you can focus on scaling.
      </p>

      {/* Features Grid */}
      <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-xl border border-white/10 bg-[#0d0d1a] p-6 transition-all hover:border-white/20 hover:bg-[#12122a]"
          >
            {/* Icon */}
            <div className={`mb-4 inline-flex rounded-lg p-3 ${feature.iconBg}`}>
              <span className={feature.iconColor}>{feature.icon}</span>
            </div>

            {/* Title */}
            <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>

            {/* Description */}
            <p className="mb-4 text-sm leading-relaxed text-zinc-400">{feature.description}</p>

            {/* Tag */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#171738] px-3 py-1">
              <svg
                className="h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="#6a4cff"
              >
                <path d="m422-232 207-248H469l29-227-185 267h139l-30 208ZM320-80l40-280H160l360-520h80l-40 320h240L400-80h-80Zm151-390Z" />
              </svg>
              <span className="text-xs font-medium text-[#6a4cff]">{feature.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

