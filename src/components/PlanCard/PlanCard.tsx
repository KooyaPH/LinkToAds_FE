interface PlanCardProps {
  plan: string;
  adsThisMonth: number;
  limit: number;
}

export default function PlanCard({ plan, adsThisMonth, limit }: PlanCardProps) {
  const usagePercent =
    !limit || limit === Infinity ? 0 : Math.min(100, (adsThisMonth / limit) * 100);

  return (
    <div className="mb-6 flex justify-center lg:justify-end lg:absolute lg:top-8 lg:right-16 lg:mb-0">
      <div className="rounded-lg border border-[#1a1a22] bg-[#050712] px-4 py-3 w-full max-w-md sm:max-w-lg sm:w-auto shadow-sm shadow-purple-500/20">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <span className="text-sm font-medium text-white">Plan</span>
          </div>
          <span className="rounded-full bg-[#111827] px-3 py-0.5 text-[11px] font-semibold text-zinc-100 border border-[#4c1d95]">
            {plan}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-zinc-400">Ads this month</span>
          <span className="text-white font-medium">
            {adsThisMonth} / {limit === Infinity ? "∞" : limit}
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full rounded-full bg-[#1f2937] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#8b5cf6]"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
