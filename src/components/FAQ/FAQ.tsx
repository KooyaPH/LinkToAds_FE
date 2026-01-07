"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Is LinkToAds free to use?",
    answer:
      "Yes! We offer a free plan that includes 5 ad generations, 5 AI copy refinements, and standard exports. No credit card required to get started.",
  },
  {
    question: "What is a credit and how does it work?",
    answer:
      "1 Credit = 1 Ad Generation. When you generate a new ad creative from your URL, it uses 1 credit. Manual edits (changing text, colors, etc.) are always free on all plans.",
  },
  {
    question: "What's the difference between one-time and subscription plans?",
    answer:
      "One-time plans (like Starter) give you a fixed amount of credits that never expire. Subscription plans provide monthly credits that refresh each billing cycle, plus additional features like unlimited AI copy rewrites.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We offer a 7-day money-back guarantee on all subscription plans. If you're not satisfied, contact our support team for a full refund.",
  },
  {
    question: "What are the 20 ad archetypes?",
    answer:
      "Our AI uses 20 proven ad templates including Native Ads, Carousel Ads, Story Ads, Video Thumbnails, and more. Each archetype is optimized for different campaign goals and platforms.",
  },
  {
    question: "Can I regenerate just the copy without using credits?",
    answer:
      "On Creator plan and above, AI copy regeneration is unlimited and free. On lower plans, AI text regeneration costs credits, but manual text edits are always free.",
  },
  {
    question: "What's included in the Agency plan?",
    answer:
      "The Agency plan includes unlimited credits, team accounts, brand kits for multiple clients, white-label reporting, API access, and a dedicated account manager.",
  },
  {
    question: "Does it automatically find images from my website?",
    answer:
      "Yes! Our AI automatically scans your website URL to extract relevant images, logos, brand colors, and content to generate contextually accurate ad creatives.",
  },
];

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`h-5 w-5 flex-shrink-0 text-zinc-400 transition-transform duration-200 ${
        isOpen ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="flex flex-col items-center px-6 py-20 scroll-mt-20">
      {/* Headline */}
      <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
        Frequently Asked{" "}
        <span className="bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
          Questions
        </span>
      </h2>

      {/* Subheadline */}
      <p className="mt-4 text-center text-zinc-400">
        Got questions? We've got answers.
      </p>

      {/* FAQ List */}
      <div className="mt-12 w-full max-w-3xl space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-xl border border-white/10 bg-[#0d0d1a] transition-all"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex w-full items-center justify-between px-6 py-4 text-left"
            >
              <span className="text-sm font-medium text-white md:text-base">
                {faq.question}
              </span>
              <ChevronIcon isOpen={openIndex === index} />
            </button>

            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? "max-h-96 pb-4" : "max-h-0"
              }`}
            >
              <p className="px-6 text-sm leading-relaxed text-zinc-400">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

