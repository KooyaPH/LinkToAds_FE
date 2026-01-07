"use client";

const testimonials = [
  {
    quote:
      "The auto-extraction is magic. It pulled our logo, product photos, and brand colors perfectly. We went from URL to 10 ads in under a minute.",
    name: "Sarah Chen",
    title: "Marketing Director, TechStart",
    initials: "SC",
  },
  {
    quote:
      "The 1-click copy regeneration is a game-changer. Client wants shorter copy? Done. Longer? Done. No more back-and-forth revisions.",
    name: "Marcus Johnson",
    title: "Founder & CEO, GrowthLabs",
    initials: "MJ",
  },
  {
    quote:
      "20 ad archetypes means we never run out of creative angles. Social proof, urgency, educational — all proven templates ready to go.",
    name: "Emily Rodriguez",
    title: "E-commerce Manager, StyleHub",
    initials: "ER",
  },
  {
    quote:
      "Finally, all banner sizes in one click. Square, portrait, story, landscape — perfect for every Facebook and Instagram placement.",
    name: "David Kim",
    title: "Performance Marketer, ScaleUp M...",
    initials: "DK",
  },
];

function StarRating() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="flex flex-col items-center px-6 py-20">
      {/* Headline */}
      <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
        Loved by{" "}
        <span className="bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
          Marketers
        </span>
      </h2>

      {/* Subheadline */}
      <p className="mt-4 max-w-xl text-center text-zinc-400">
        Join thousands of marketers who've transformed their ad creation workflow.
      </p>

      {/* Testimonials Grid */}
      <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="flex flex-col rounded-xl border border-white/10 bg-[#0d0d1a] p-5"
          >
            {/* Stars */}
            <StarRating />

            {/* Quote */}
            <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-300">
              "{testimonial.quote}"
            </p>

            {/* Author */}
            <div className="mt-5 flex items-center gap-3">
              {/* Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0d0d1a] border border-white/10 text-sm font-semibold text-white">
                {testimonial.initials}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                <p className="truncate text-xs text-zinc-500">{testimonial.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

