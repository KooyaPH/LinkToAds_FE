export default function BannerLoading({ count = 3 }: { count?: number }) {
  return (
    <section className="flex-1 flex flex-col items-center justify-center px-8 pb-24 pt-8">
      <div className="w-full max-w-2xl rounded-xl border border-[#1a1a22] bg-[#0d1117] p-12 flex flex-col items-center">
        {/* Animated Loading Spinner with Star */}
        <div className="relative mb-8">
          {/* Circular orbit spinner */}
          <div className="h-20 w-20 relative">
            <svg className="h-20 w-20 animate-spin" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray="10 20"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6666FF" />
                  <stop offset="100%" stopColor="#FF66FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Star icon on top right of spinner */}
          <div className="absolute -top-1 -right-1 animate-pulse">
            <svg
              className="h-6 w-6 text-[#FF66FF]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
        </div>

        {/* Main Status Text */}
        <p className="text-white text-lg font-medium mb-3">
          Generating {count} professional banners...
        </p>

        {/* Estimated Time Text */}
        <p className="text-zinc-400 text-sm mb-6">
          This may take 1-2 minutes.
        </p>

        {/* Pulsating Dots */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-2 w-2 rounded-full bg-[#6666FF] animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="h-2 w-2 rounded-full bg-[#6666FF] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-2 w-2 rounded-full bg-[#6666FF] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Secondary Status Text */}
        <p className="text-zinc-400 text-sm">
          Processing in parallel
        </p>
      </div>
    </section>
  );
}
