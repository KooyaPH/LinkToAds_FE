"use client";

import { useEffect } from "react";

interface ToastProps {
  show: boolean;
  message: string;
  onClose?: () => void;
  duration?: number; // Auto-hide duration in milliseconds
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
}

export default function Toast({
  show,
  message,
  onClose,
  duration = 3000,
  position = "top-right",
}: ToastProps) {
  // Auto-hide toast after duration
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  // Position classes
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 animate-slide-down-up`}>
      <div className="bg-[#0a0a0f] border border-[#141533] rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg min-w-[320px]">
        {/* Checkmark Icon */}
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center">
          <svg
            className="w-4 h-4 text-[#0a0a0f]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        {/* Toast Text */}
        <span className="text-white text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
