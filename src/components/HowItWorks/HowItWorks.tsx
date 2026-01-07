"use client";

const steps = [
  {
    step: 1,
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    title: "Paste Your URL",
    description: "Drop any website URL — we automatically scrape your logo, images, brand colors, and key messaging.",
  },
  {
    step: 2,
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    title: "AI Analyzes Everything",
    description: "Our AI identifies your USP, target audience, offers, and brand tone to craft winning ad angles.",
  },
  {
    step: 3,
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: "Customize & Generate",
    description: "Choose from 20 ad archetypes, pick banner sizes, and upload additional assets if needed.",
  },
  {
    step: 4,
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "Edit & Download",
    description: "Fine-tune copy, regenerate per ad, and download ready-to-launch creatives.",
  },
];

export default function HowItWorks() {
  return (
    <section className="flex flex-col items-center px-6 py-20">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2">
        <span className="text-sm font-medium text-cyan-400">Simple Process</span>
      </div>

      {/* Headline */}
      <h2 className="text-center text-3xl font-bold text-white md:text-4xl lg:text-5xl">
        How It{" "}
        <span className="bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
          Works
        </span>
      </h2>

      {/* Subheadline */}
      <p className="mt-4 text-center text-zinc-400">
        From URL to ready-to-launch ads in four simple steps
      </p>

      {/* Steps */}
      <div className="relative mt-16 w-full max-w-5xl">
        {/* Connecting Line - Desktop */}
        <div className="absolute left-0 right-0 top-7 hidden h-0.5 bg-gradient-to-r from-[#a855f7] via-[#c084fc] to-[#a855f7] md:block" />

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.step} className="relative flex flex-col items-center text-center">
              {/* Icon Circle */}
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] text-white shadow-lg shadow-purple-500/30">
                {step.icon}
              </div>

              {/* Step Number */}
              <span className="mt-4 text-sm font-medium text-purple-400">Step {step.step}</span>

              {/* Title */}
              <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>

              {/* Description */}
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.description}</p>

              {/* Mobile Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute -bottom-4 left-1/2 h-8 w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#a855f7] to-transparent md:hidden" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

