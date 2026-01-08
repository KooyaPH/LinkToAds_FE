"use client";

const businessTypes = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "E-Commerce",
    description: "Auto-extract visuals and generate social proof ads that drive purchases.",
    iconBg: "bg-[#2b1b4b]",
    iconColor: "text-[#6a4cff]",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Service Providers",
    description: "Turn your service page into scroll-stopping ads. Highlight benefits, testimonials, and results.",
    iconBg: "bg-[#2b1b4b]",
    iconColor: "text-[#6a4cff]",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "SaaS & Tech",
    description: "Use educational archetypes to highlight features and drive free trial signups.",
    iconBg: "bg-[#2b1b4b]",
    iconColor: "text-[#6a4cff]",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Agencies",
    description: "Regenerate copy in seconds for client revisions. Short, medium, or long — instant.",
    iconBg: "bg-[#2b1b4b]",
    iconColor: "text-[#6a4cff]",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Startups",
    description: "Launch campaigns fast with proven archetypes. No design team needed.",
    iconBg: "bg-[#2b1b4b]",
    iconColor: "text-[#6a4cff]",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
    title: "Local Businesses",
    description: "Professional-quality ads from your website. Multiple sizes for every placement.",
    iconBg: "bg-[#2b1b4b]",
    iconColor: "text-[#6a4cff]",
  },
];

export default function BusinessTypes() {
  return (
    <section className="flex flex-col items-center px-6 py-20">
      {/* Headline */}
      <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
        Built for{" "}
        <span className="bg-gradient-to-r from-[#6666FF] to-[#FF66FF] bg-clip-text text-transparent">
          Every Business
        </span>
      </h2>

      {/* Subheadline */}
      <p className="mt-4 max-w-xl text-center text-zinc-400">
        From solo founders to agencies, our AI adapts to your unique needs.
      </p>

      {/* Business Types Grid */}
      <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
        {businessTypes.map((type) => (
          <div
            key={type.title}
            className="group rounded-xl border border-white/10 bg-[#0d0d1a] p-6 transition-all hover:border-white/20 hover:bg-[#12122a]"
          >
            {/* Icon */}
            <div className={`mb-4 inline-flex rounded-lg p-3 ${type.iconBg}`}>
              <span className={type.iconColor}>{type.icon}</span>
            </div>

            {/* Title */}
            <h3 className="mb-2 text-lg font-semibold text-white">{type.title}</h3>

            {/* Description */}
            <p className="text-sm leading-relaxed text-zinc-400">{type.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

