"use client";

import { useState, useEffect } from "react";

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
}

type BillingPeriod = "monthly" | "quarterly" | "6months" | "yearly";

// Base monthly prices
const PLAN_PRICES = {
  creator: 29,
  business: 67,
  agency: 297,
};

// Discount percentages
const DISCOUNTS = {
  monthly: 0,
  quarterly: 0.1,
  "6months": 0.15,
  yearly: 0.25,
};

// Period multipliers
const PERIOD_MULTIPLIERS = {
  monthly: 1,
  quarterly: 3,
  "6months": 6,
  yearly: 12,
};

// Period labels
const PERIOD_LABELS = {
  monthly: "/mo",
  quarterly: "/3mo",
  "6months": "/6mo",
  yearly: "/12mo",
};

export default function UpgradePlanModal({
  isOpen,
  onClose,
  currentPlan,
}: UpgradePlanModalProps) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  // Calculate pricing for a plan
  const calculatePrice = (basePrice: number) => {
    const discount = DISCOUNTS[billingPeriod];
    const multiplier = PERIOD_MULTIPLIERS[billingPeriod];
    const totalPrice = basePrice * multiplier * (1 - discount);
    const effectiveMonthly = totalPrice / multiplier;
    
    return {
      total: Math.round(totalPrice),
      effectiveMonthly: Math.round(effectiveMonthly),
      periodLabel: PERIOD_LABELS[billingPeriod],
      discount: discount * 100,
    };
  };

  // Get discount banner text
  const getDiscountBannerText = () => {
    const discount = DISCOUNTS[billingPeriod] * 100;
    if (discount === 0) return null;
    
    const periodNames = {
      quarterly: "quarterly",
      "6months": "6 months",
      yearly: "yearly",
    };
    
    return `Save ${discount}% with ${periodNames[billingPeriod]} billing`;
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto bg-[#0d1117] rounded-2xl border border-[#1a1a22] shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="h-6 w-6 text-[#6a4cff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-white">Upgrade Your Plan</h2>
            </div>
            <p className="text-sm text-zinc-400 ml-9">
              Unlock more ad generations and premium features!
            </p>
          </div>

          {/* Billing Period Selector */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 p-1 bg-[#12121a] rounded-full w-fit">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  billingPeriod === "monthly"
                    ? "bg-[#6a4cff] text-white"
                    : "text-zinc-400"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("quarterly")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  billingPeriod === "quarterly"
                    ? "bg-[#6a4cff] text-white"
                    : "text-zinc-400"
                }`}
              >
                <span>Quarterly </span>
                <span className={billingPeriod === "quarterly" ? "text-white" : "text-green-400"}>-10%</span>
              </button>
              <button
                onClick={() => setBillingPeriod("6months")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  billingPeriod === "6months"
                    ? "bg-[#6a4cff] text-white"
                    : "text-zinc-400"
                }`}
              >
                <span>6 Months </span>
                <span className={billingPeriod === "6months" ? "text-white" : "text-green-400"}>-15%</span>
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  billingPeriod === "yearly"
                    ? "bg-[#6a4cff] text-white"
                    : "text-zinc-400"
                }`}
              >
                <span>Yearly </span>
                <span className={billingPeriod === "yearly" ? "text-white" : "text-green-400"}>-25%</span>
              </button>
            </div>
          </div>

          {/* Discount Banner */}
          {getDiscountBannerText() && (
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
                <span className="text-lg">🎉</span>
                <span className="text-sm font-semibold text-green-400">
                  {getDiscountBannerText()}
                </span>
              </div>
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Starter Pack */}
            <div className="relative rounded-xl border border-[#1a1a22] bg-[#12121a] p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">Starter Pack</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">$7</span>
                  <span className="text-sm text-zinc-400">one-time</span>
                </div>
                <p className="text-sm text-zinc-400 mt-1">Includes: 25 credits</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-[#6a4cff] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-white">25 ad credits</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-[#6a4cff] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-white">All 20 archetypes</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-[#6a4cff] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-white">Never expires</span>
                </li>
              </ul>
              <button className="w-full rounded-lg bg-[#1a1a22] border border-[#202a3a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#202a3a] transition-all">
                Select
              </button>
            </div>

            {/* Creator - Current Plan */}
            <div
              className={`relative rounded-xl border-2 p-6 ${
                currentPlan === "creator"
                  ? "border-[#6a4cff] bg-[#12121a]"
                  : "border-[#1a1a22] bg-[#12121a]"
              }`}
            >
              {currentPlan === "creator" && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Current
                  </span>
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">Creator</h3>
                {(() => {
                  const price = calculatePrice(PLAN_PRICES.creator);
                  return billingPeriod === "monthly" ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">${price.total}</span>
                        <span className="text-sm text-zinc-400">/mo</span>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">Includes: 160/mo</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">${price.total}</span>
                        <span className="text-sm text-zinc-400">{price.periodLabel}</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-sm text-green-400 font-semibold">${price.effectiveMonthly}/mo</span>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">Includes: 160/mo</p>
                    </>
                  );
                })()}
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-[#6a4cff] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-white">160 credits/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-[#6a4cff] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-white">Unlimited AI rewrites</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-[#6a4cff] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-white">1 Brand Kit</span>
                </li>
              </ul>
              {currentPlan === "creator" ? (
                <button className="w-full rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all">
                  Current Plan
                </button>
              ) : (
                <button className="w-full rounded-lg bg-[#1a1a22] border border-[#202a3a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#202a3a] transition-all">
                  Select
                </button>
              )}
            </div>

            {/* Business */}
            <div className="relative rounded-xl border border-[#1a1a22] bg-[#12121a] p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">Business</h3>
                {(() => {
                  const price = calculatePrice(PLAN_PRICES.business);
                  return billingPeriod === "monthly" ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">${price.total}</span>
                        <span className="text-sm text-zinc-400">/mo</span>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">Includes: 800/mo</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">${price.total}</span>
                        <span className="text-sm text-zinc-400">{price.periodLabel}</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-sm text-green-400 font-semibold">${price.effectiveMonthly}/mo</span>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">Includes: 800/mo</p>
                    </>
                  );
                })()}
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-[#6a4cff] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-white">800 credits/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-[#6a4cff] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-white">Competitor Spy Tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-[#6a4cff] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-white">Priority Rendering</span>
                </li>
              </ul>
              <button className="w-full rounded-lg bg-[#1a1a22] border border-[#202a3a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#202a3a] transition-all">
                Select
              </button>
            </div>

            {/* Agency */}
            <div className="relative rounded-xl border border-[#1a1a22] bg-[#12121a] p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">Agency</h3>
                {(() => {
                  const price = calculatePrice(PLAN_PRICES.agency);
                  return billingPeriod === "monthly" ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">${price.total}</span>
                        <span className="text-sm text-zinc-400">/mo</span>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">Includes: Unlimited</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">${price.total}</span>
                        <span className="text-sm text-zinc-400">{price.periodLabel}</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-sm text-green-400 font-semibold">${price.effectiveMonthly}/mo</span>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">Includes: Unlimited</p>
                    </>
                  );
                })()}
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-[#6a4cff] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-white">Unlimited credits</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-[#6a4cff] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-white">White Labeling</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-[#6a4cff] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-white">API Access</span>
                </li>
              </ul>
              <button className="w-full rounded-lg bg-[#1a1a22] border border-[#202a3a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#202a3a] transition-all">
                Select
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-[#1a1a22]">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-[#6a4cff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-sm text-white">Secure checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-[#6a4cff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-sm text-white">Instant access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
