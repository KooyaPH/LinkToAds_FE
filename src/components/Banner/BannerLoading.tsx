import { LoadingSpinner } from "@/components";

export default function BannerLoading({ count = 3 }: { count?: number }) {
  return (
    <section className="flex-1 flex flex-col items-center justify-center px-8 pb-24 pt-8">
      <div className="w-full max-w-2xl rounded-xl border border-[#1a1a22] bg-[#0d1117] p-12 flex flex-col items-center">
        {/* Animated Loading Spinner */}
        <div className="mb-8">
          <LoadingSpinner size="lg" />
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
