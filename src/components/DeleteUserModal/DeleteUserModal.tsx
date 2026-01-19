"use client";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  userEmail,
  onConfirm,
  isDeleting = false,
}: DeleteUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl border border-[#1a1a22] bg-[#0d1117] p-6 shadow-2xl">
        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-4">Delete User</h2>

        {/* Message */}
        <p className="text-sm text-white mb-6">
          Are you sure you want to delete <strong>{userEmail}</strong>? This will permanently remove their account, campaigns, and all ads. This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}
