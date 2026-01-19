"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";

interface EditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userId: string;
  currentPlan?: string;
  currentMonthlyLimit?: number;
  onSave: () => void;
}

interface Plan {
  id: string;
  name: string;
  adsPerMonth: number;
  price: number;
}

export default function EditSubscriptionModal({
  isOpen,
  onClose,
  userEmail,
  userId,
  currentPlan = "starter",
  currentMonthlyLimit = 5,
  onSave,
}: EditSubscriptionModalProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan);
  const [monthlyLimit, setMonthlyLimit] = useState<string>(
    currentMonthlyLimit > 0 ? currentMonthlyLimit.toString() : ""
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch plans and user's current plan
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          
          // Fetch available plans
          const plansResponse = await api.getPlans();
          if (plansResponse.success && plansResponse.data?.plans) {
            setPlans(plansResponse.data.plans);
          }

          // Fetch user's current plan if not provided
          if (!currentPlan || currentMonthlyLimit === undefined) {
            const planResponse = await api.getUserPlan(userId);
            if (planResponse.success && planResponse.data) {
              setSelectedPlan(planResponse.data.plan);
              setMonthlyLimit(
                planResponse.data.monthlyLimit > 0
                  ? planResponse.data.monthlyLimit.toString()
                  : ""
              );
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isOpen, userId, currentPlan, currentMonthlyLimit]);

  // Set initial values when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setSelectedPlan(currentPlan);
      setMonthlyLimit(
        currentMonthlyLimit > 0 ? currentMonthlyLimit.toString() : ""
      );
      setIsDropdownOpen(false);
    }
  }, [isOpen, currentPlan, currentMonthlyLimit]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const limit = monthlyLimit.trim() === "" ? null : parseInt(monthlyLimit);
      
      const response = await api.updateUserPlan(userId, selectedPlan, limit);
      
      if (response.success) {
        onSave();
        onClose();
      } else {
        console.error("Error saving subscription:", response.message);
        alert(response.message || "Failed to update subscription");
      }
    } catch (error) {
      console.error("Error saving subscription:", error);
      alert("Failed to update subscription. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);
  const planDisplayName = selectedPlanData
    ? `${selectedPlanData.name} (${selectedPlanData.adsPerMonth === -1 ? "Unlimited" : `${selectedPlanData.adsPerMonth} ads/month`})`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl border border-[#1a1a22] bg-[#0d1117] p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg
            className="h-5 w-5"
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

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-1">Edit Subscription</h2>
        <p className="text-sm text-zinc-400 mb-6">
          Modify subscription for {userEmail}
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-4 border-zinc-600 border-t-purple-500"></div>
          </div>
        ) : (
          <>
            {/* Plan Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Plan
              </label>
              <div className="relative" ref={dropdownRef}>
                {/* Dropdown Button */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between rounded-lg border border-[#1a1a22] bg-[#0a0a0f] px-4 py-3 text-sm text-white focus:border-[#684bf9] focus:outline-none hover:bg-[#12121a] transition-colors"
                >
                  <span>
                    {selectedPlanData
                      ? `${selectedPlanData.name} (${selectedPlanData.adsPerMonth === -1 ? "Unlimited" : `${selectedPlanData.adsPerMonth} ads/month`})`
                      : "Select a plan"}
                  </span>
                  <svg
                    className={`h-5 w-5 text-white transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 rounded-lg border border-[#1a1a22] bg-[#1a1a3e] shadow-2xl overflow-hidden">
                    {plans.map((plan) => {
                      const isSelected = plan.id === selectedPlan;
                      const planDisplay = `${plan.name} (${plan.adsPerMonth === -1 ? "Unlimited" : `${plan.adsPerMonth} ads/month`})`;
                      
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => {
                            setSelectedPlan(plan.id);
                            if (plan.adsPerMonth !== -1) {
                              setMonthlyLimit(plan.adsPerMonth.toString());
                            } else {
                              setMonthlyLimit("");
                            }
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-white transition-colors ${
                            isSelected
                              ? "bg-[#c34cff]"
                              : "bg-[#0b111e] hover:bg-[#2a2a4e]"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="h-5 w-5 flex-shrink-0"
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
                          )}
                          {!isSelected && <div className="h-5 w-5 flex-shrink-0" />}
                          <span>{planDisplay}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Limit */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Monthly Limit
              </label>
              <input
                type="number"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                placeholder="5"
                className="w-full rounded-lg border border-[#1a1a22] bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#684bf9] focus:outline-none"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Leave empty for unlimited ads
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-lg border border-[#1a1a22] bg-[#0a0a0f] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a1a22]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg bg-[#7C3AED] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#8B5CF6] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#7C3AED]"
                style={{
                  textShadow: '0 0 8px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
                }}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
