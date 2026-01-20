"use client";

interface ConfirmCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  emailType: string;
  targetAudience: string;
  recipientCount: number;
  isSending?: boolean;
}

const emailTypeLabels: { [key: string]: string } = {
  'special-offer': 'Special Offer',
  'feature-highlight': 'Feature Highlight',
  'upgrade-nudge': 'Upgrade Nudge',
  'referral-invite': 'Referral Invite',
};

const audienceLabels: { [key: string]: string } = {
  'all': 'All Users',
  'free': 'Free Users Only',
  'paid': 'Paid Users Only',
  'inactive': 'Inactive Users',
};

export default function ConfirmCampaignModal({
  isOpen,
  onClose,
  onConfirm,
  emailType,
  targetAudience,
  recipientCount,
  isSending = false,
}: ConfirmCampaignModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md mx-4">
        <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-[#1a1a22]">
            <h2 className="text-2xl font-bold text-white">Confirm Campaign</h2>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-white">You are about to send:</p>

            {/* Campaign Details Box */}
            <div className="rounded-lg border border-[#1a1a22] bg-[#0a0a0f] p-4 space-y-3">
              <div className="text-white">
                <span className="text-zinc-400">Email Type: </span>
                <span>{emailTypeLabels[emailType] || emailType}</span>
              </div>
              <div className="text-white">
                <span className="text-zinc-400">Audience: </span>
                <span>{audienceLabels[targetAudience] || targetAudience}</span>
              </div>
              <div>
                <span className="text-zinc-400">Recipients: </span>
                <span className="text-[#6348f0]">{recipientCount} users</span>
              </div>
            </div>

            {/* Warning */}
            <p className="text-red-500 text-sm font-medium">
              This action cannot be undone. Are you sure?
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-[#1a1a22] flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSending}
              className="px-6 py-2.5 rounded-lg border border-[#1a1a22] bg-[#0a0a0f] text-white text-sm font-medium hover:bg-[#1a1a22] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isSending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#6348f0] text-white text-sm font-medium hover:bg-[#5538d0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5 transform rotate-[30deg]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  <span>Send to {recipientCount} users</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
