"use client";

import { useState } from "react";

type BillingPeriod = "monthly" | "quarterly" | "halfYear" | "yearly";

const billingOptions = [
  { id: "monthly" as BillingPeriod, label: "Monthly", discount: 0, months: 1, periodLabel: "mo" },
  { id: "quarterly" as BillingPeriod, label: "Quarterly", discount: 10, months: 3, periodLabel: "3mo" },
  { id: "halfYear" as BillingPeriod, label: "Half Year", discount: 15, months: 6, periodLabel: "6mo" },
  { id: "yearly" as BillingPeriod, label: "Yearly", discount: 25, months: 12, periodLabel: "yr" },
];

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Try it out risk-free",
    features: ["5 Ad Generations", "5 AI Copy Refinements", "Standard Exports"],
    cta: "Start Free",
    highlighted: false,
    oneTime: false,
    isSubscription: false,
  },
  {
    name: "Starter",
    price: 7,
    period: "one-time",
    description: "Great for testing campaigns",
    features: ["25 Ad Credits", "All 20 Archetypes", "AI Regen costs credits"],
    cta: "Buy Starter Pack",
    highlighted: false,
    oneTime: true,
    isSubscription: false,
  },
  {
    name: "Creator",
    price: 29,
    period: "mo",
    description: "Perfect for content creators",
    features: ["160 Credits/mo", "UNLIMITED AI Copy Rewrites", "1 Brand Kit"],
    cta: "Get Creator",
    highlighted: true,
    badge: "MOST POPULAR",
    oneTime: false,
    isSubscription: true,
  },
  {
    name: "Business",
    price: 67,
    period: "mo",
    description: "For scaling teams",
    features: ["800 Credits/mo", "Competitor Spy Tools", "Priority Rendering"],
    cta: "Go Business",
    highlighted: false,
    oneTime: false,
    isSubscription: true,
  },
  {
    name: "Agency",
    price: 297,
    period: "mo",
    description: "White-label everything",
    features: ["Unlimited Credits", "White Labeling", "API Access"],
    cta: "Contact Sales",
    highlighted: false,
    oneTime: false,
    isSubscription: true,
  },
];

function CheckIcon() {
  return (
    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1d1b49]">
      <svg className="h-3 w-3 text-[#6348f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function HighlightedCheckIcon() {
  return (
    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1d1b49]">
      <svg className="h-3 w-3 text-[#6348f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  const currentBilling = billingOptions.find((b) => b.id === billingPeriod)!;

  const getPrice = (basePrice: number, isSubscription: boolean) => {
    if (!isSubscription || basePrice === 0) return basePrice;
    // Calculate total for the period with discount
    const totalMonthly = basePrice * currentBilling.months;
    const discountedTotal = Math.round(totalMonthly * (1 - currentBilling.discount / 100));
    return discountedTotal;
  };

  const getOriginalPrice = (basePrice: number, isSubscription: boolean) => {
    if (!isSubscription || basePrice === 0 || billingPeriod === "monthly") return null;
    return basePrice * currentBilling.months;
  };

  const getPeriodLabel = (plan: typeof plans[0]) => {
    if (plan.oneTime) return "one-time";
    if (!plan.isSubscription) return plan.period;
    return currentBilling.periodLabel;
  };

  const getMonthlyEquivalent = (basePrice: number, isSubscription: boolean) => {
    if (!isSubscription || basePrice === 0 || billingPeriod === "monthly") return null;
    const discountedMonthly = Math.round(basePrice * (1 - currentBilling.discount / 100));
    return discountedMonthly;
  };

  return (
    <section id="pricing" className="flex flex-col items-center px-6 py-20 scroll-mt-20">
      {/* Headline */}
      <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
        Simple, Transparent{" "}
        <span className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
          Pricing
        </span>
      </h2>

      {/* Subheadline */}
      <p className="mt-4 text-center text-zinc-400">
        From free to agency-scale. Pick what fits.
      </p>

      {/* Billing Toggle */}
      <div className="mt-8 flex rounded-lg border border-white/10 bg-[#0d0d1a] p-1">
        {billingOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setBillingPeriod(option.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              billingPeriod === option.id
                ? "bg-[#6a4cff] text-white"
                : "text-white hover:text-white"
            }`}
          >
            {option.label}
            {option.discount > 0 && (
              <span className={`ml-1 text-xs ${billingPeriod === option.id ? "text-white" : "text-green-400"}`}>
                -{option.discount}%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Savings Badge */}
      {currentBilling.discount > 0 && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
          <span className="text-sm">🎉</span>
          <span className="text-sm font-medium text-green-400">
            Save {currentBilling.discount}% with {currentBilling.label.toLowerCase()} billing
          </span>
        </div>
      )}

      {/* Pricing Cards - Top Row */}
      <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
        {plans.slice(0, 3).map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-xl border p-6 ${
              plan.highlighted
                ? "border-purple-500/50 bg-[#0d0d1a] shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                : "border-white/10 bg-[#0d0d1a]"
            }`}
          >
            {/* Badge */}
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-3 py-1 text-xs font-semibold text-white">
                {plan.badge}
              </span>
            )}

            {/* Plan Name */}
            <h3 className={`${plan.highlighted ? "text-xl font-bold text-white" : "text-lg font-medium text-zinc-400"}`}>{plan.name}</h3>

            {/* Price */}
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">
                ${getPrice(plan.price, plan.isSubscription)}
              </span>
              <span className="text-zinc-500">/{getPeriodLabel(plan)}</span>
            </div>

            {/* Original Price (crossed out) */}
            {getOriginalPrice(plan.price, plan.isSubscription) && (
              <p className="mt-1 text-sm text-zinc-500 line-through">
                ${getOriginalPrice(plan.price, plan.isSubscription)}/{getPeriodLabel(plan)}
              </p>
            )}

            {/* Description */}
            <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>

            {/* Features */}
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-white">
                  {plan.highlighted ? <HighlightedCheckIcon /> : <CheckIcon />}
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold transition-all ${
                plan.highlighted
                  ? "bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white hover:opacity-90"
                  : "border border-white/10 bg-transparent text-white hover:bg-white/5"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Pricing Cards - Bottom Row */}
      <div className="mt-4 grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
        {plans.slice(3).map((plan) => (
          <div
            key={plan.name}
            className="flex flex-col rounded-xl border border-white/10 bg-[#0d0d1a] p-6"
          >
            {/* Plan Name */}
            <h3 className="text-lg font-medium text-zinc-400">{plan.name}</h3>

            {/* Price */}
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">
                ${getPrice(plan.price, plan.isSubscription)}
              </span>
              <span className="text-zinc-500">/{getPeriodLabel(plan)}</span>
            </div>

            {/* Original Price (crossed out) */}
            {getOriginalPrice(plan.price, plan.isSubscription) && (
              <p className="mt-1 text-sm text-zinc-500 line-through">
                ${getOriginalPrice(plan.price, plan.isSubscription)}/{getPeriodLabel(plan)}
              </p>
            )}

            {/* Description */}
            <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>

            {/* Features */}
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-zinc-300">
                  <CheckIcon />
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button className="mt-6 w-full rounded-lg border border-white/10 bg-transparent py-3 text-sm font-semibold text-white transition-all hover:bg-white/5">
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Credits Info */}
      <div className="mt-8 w-full max-w-5xl rounded-xl border border-[#251f48] bg-[#1a1a22] p-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-4">
            <svg className="h-5 w-5 flex-shrink-0 text-[#8660b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-bold text-white">How Credits Work</h4>
          </div>
          <p className="text-sm text-zinc-400">
            <span className="text-[#6a4cff]">1 Credit = 1 Ad Generation</span> — simple as that.{" "}
            <span className="text-[#22c55e]">Manual Edits</span> <span className="text-zinc-400">(changing text/color yourself)</span> are{" "}
            <span className="font-bold text-[#22c55e]">100% FREE</span> <span className="text-zinc-400">on all plans. Only</span>{" "}
            <span className="text-[#6a4cff]">AI Text Regeneration</span> <span className="text-zinc-400">costs credits (unless you're on the</span>{" "}
            <span className="font-bold text-[#8660b6]">Creator plan or above</span> <span className="text-zinc-400">where it's unlimited).</span>
          </p>
        </div>
      </div>
    </section>
  );
}
