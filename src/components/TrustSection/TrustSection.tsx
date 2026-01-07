"use client";

const companies = [
  "TechCorp",
  "StartupXY",
  "GrowthCo",
  "AdPros",
  "ScaleUp",
  "BrandMax",
];

const stats = [
  {
    value: "50,000+",
    label: "Ads Generated",
    gradient: "from-[#ec4899] to-[#f472b6]",
  },
  {
    value: "20",
    label: "Ad Archetypes",
    gradient: "from-[#a855f7] to-[#c084fc]",
  },
  {
    value: "4",
    label: "Banner Sizes",
    gradient: "from-[#94a3b8] to-[#cbd5e1]",
  },
  {
    value: "60s",
    label: "Average Time",
    gradient: "from-[#22d3ee] to-[#67e8f9]",
  },
];

export default function TrustSection() {
  return (
    <section className="flex flex-col items-center px-6 py-16">
      {/* Trust Header */}
      <p className="text-sm text-zinc-400">
        Trusted by{" "}
        <span className="font-semibold text-white">1,000+ marketers</span>{" "}
        worldwide
      </p>

      {/* Company Logos */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {companies.map((company) => (
          <span
            key={company}
            className="text-lg font-semibold text-zinc-500 transition-colors hover:text-zinc-300"
          >
            {company}
          </span>
        ))}
      </div>

      {/* Stats Container */}
      <div className="mt-16 w-screen border-y border-white/10 bg-[#0d0d1a] px-8 py-12 md:px-12 md:py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <span
                className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl lg:text-6xl`}
              >
                {stat.value}
              </span>
              <span className="mt-2 text-sm text-zinc-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

