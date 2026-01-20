"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import EditSubscriptionModal from "@/components/EditSubscriptionModal";
import DeleteUserModal from "@/components/DeleteUserModal";

export type User = {
  id: string;
  email: string;
  name: string;
  authMethod: "google" | "email";
  status: string;
  utmSource: string | null;
  referrer: string;
  joined: string | null;
  plan?: string;
  monthlyLimit?: number;
};

interface AllSignUpsTableProps {
  users: User[];
  onUserUpdate?: () => void;
}

export default function AllSignUpsTable({ users, onUserUpdate }: AllSignUpsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAll, setFilterAll] = useState("All");
  const [filterMethod, setFilterMethod] = useState("All Methods");
  const [filterSource, setFilterSource] = useState("All Sources");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = {
    all: useRef<HTMLDivElement>(null),
    method: useRef<HTMLDivElement>(null),
    source: useRef<HTMLDivElement>(null),
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        dropdownRefs[openDropdown as keyof typeof dropdownRefs]?.current &&
        !dropdownRefs[openDropdown as keyof typeof dropdownRefs].current?.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  // Filter users based on search query and filters
  const filteredUsers = users.filter((user) => {
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        user.email.toLowerCase().includes(query) ||
        (user.name && user.name.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Status filter (All/Paid/Free)
    if (filterAll !== "All") {
      if (filterAll === "Paid" && user.status !== "Paid") return false;
      if (filterAll === "Free" && user.status !== "Free") return false;
    }

    // Auth method filter
    if (filterMethod !== "All Methods") {
      if (filterMethod === "Google" && user.authMethod !== "google") return false;
      if (filterMethod === "Email" && user.authMethod !== "email") return false;
    }

    // Source filter (UTM Source or Referrer)
    if (filterSource !== "All Sources") {
      const filterLower = filterSource.toLowerCase();
      const utmMatch = user.utmSource?.toLowerCase() === filterLower;
      const referrerMatch = user.referrer?.toLowerCase().includes(filterLower);
      if (!utmMatch && !referrerMatch) return false;
    }

    return true;
  });

  return (
    <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] overflow-hidden">
      {/* Header Section */}
      <div className="border-b border-[#1a1a22] p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Title with badge */}
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-white">All Sign-ups</h3>
          <span className="rounded-full bg-[#1a1a22] px-2.5 py-0.5 text-xs font-medium text-white">
            {filteredUsers.length}
          </span>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Bar */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search email, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#1a1a22] bg-[#0a0a0f] pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-[#684bf9] focus:outline-none sm:w-64"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-3">
            {/* All/Paid/Free Dropdown */}
            <div className="relative" ref={dropdownRefs.all}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "all" ? null : "all")}
                className="flex items-center gap-2 rounded-lg border border-[#1a1a22] bg-[#0a0a0f] px-4 py-2 text-sm text-white hover:border-[#2a2a32] transition-colors"
              >
                <span>{filterAll}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${openDropdown === "all" ? "rotate-180" : ""}`}
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
              {openDropdown === "all" && (
                <div className="absolute top-full left-0 mt-1 z-50 min-w-[120px] rounded-lg border border-[#1a1a22] bg-[#0a0a0f] shadow-lg overflow-hidden">
                  {["All", "Paid", "Free"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFilterAll(option);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                        filterAll === option
                          ? "bg-[#c34cff] text-white"
                          : "text-white hover:bg-[#1a1a22]"
                      }`}
                    >
                      {filterAll === option && (
                        <svg
                          className="h-4 w-4"
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
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Methods Dropdown */}
            <div className="relative" ref={dropdownRefs.method}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "method" ? null : "method")}
                className="flex items-center gap-2 rounded-lg border border-[#1a1a22] bg-[#0a0a0f] px-4 py-2 text-sm text-white hover:border-[#2a2a32] transition-colors"
              >
                <span>{filterMethod}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${openDropdown === "method" ? "rotate-180" : ""}`}
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
              {openDropdown === "method" && (
                <div className="absolute top-full left-0 mt-1 z-50 min-w-[140px] rounded-lg border border-[#1a1a22] bg-[#0a0a0f] shadow-lg overflow-hidden">
                  {["All Methods", "Google", "Email"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFilterMethod(option);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                        filterMethod === option
                          ? "bg-[#c34cff] text-white"
                          : "text-white hover:bg-[#1a1a22]"
                      }`}
                    >
                      {filterMethod === option && (
                        <svg
                          className="h-4 w-4"
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
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sources Dropdown */}
            <div className="relative" ref={dropdownRefs.source}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "source" ? null : "source")}
                className="flex items-center gap-2 rounded-lg border border-[#1a1a22] bg-[#0a0a0f] px-4 py-2 text-sm text-white hover:border-[#2a2a32] transition-colors"
              >
                <span>{filterSource}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${openDropdown === "source" ? "rotate-180" : ""}`}
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
              {openDropdown === "source" && (
                <div className="absolute top-full left-0 mt-1 z-50 min-w-[140px] rounded-lg border border-[#1a1a22] bg-[#0a0a0f] shadow-lg overflow-hidden">
                  {["All Sources", "META", "me"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFilterSource(option);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                        filterSource === option
                          ? "bg-[#c34cff] text-white"
                          : "text-white hover:bg-[#1a1a22]"
                      }`}
                    >
                      {filterSource === option && (
                        <svg
                          className="h-4 w-4"
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
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Refresh Button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1a1a22] bg-[#0a0a0f] text-zinc-400 transition-colors hover:bg-[#1a1a22] hover:text-white"
            aria-label="Refresh"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#1a1a22] bg-[#0a0a0f]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Auth Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  UTM Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Referrer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  <div className="flex items-center gap-1">
                    Joined
                    <svg
                      className="h-4 w-4"
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
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a22]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-zinc-400">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[#12121a] transition-colors"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">
                    {user.name || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {user.authMethod === "google" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#1a1a22] px-2.5 py-1 text-xs font-medium text-white">
                        <svg
                          className="h-3 w-3"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#1a1a22] px-2.5 py-1 text-xs font-medium text-white">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Email
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className="inline-flex items-center rounded-md bg-[#1a1a22] px-2.5 py-1 text-xs font-medium text-white">
                      {user.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {user.utmSource ? (
                      <span className="inline-flex items-center rounded-md bg-[#1a1a22] px-2.5 py-1 text-xs font-medium text-white">
                        {user.utmSource}
                      </span>
                    ) : (
                      <span className="text-zinc-500">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">
                    {user.referrer}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-400">
                    {user.joined || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-zinc-400 hover:text-white transition-colors"
                        aria-label="Edit"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeletingUser(user)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                        aria-label="Delete"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Subscription Modal */}
      {editingUser && (
        <EditSubscriptionModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          userEmail={editingUser.email}
          userId={editingUser.id}
          currentPlan={editingUser.plan || "starter"}
          currentMonthlyLimit={editingUser.monthlyLimit || 5}
          onSave={() => {
            if (onUserUpdate) {
              onUserUpdate();
            }
            setEditingUser(null);
          }}
        />
      )}

      {/* Delete User Modal */}
      {deletingUser && (
        <DeleteUserModal
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          userEmail={deletingUser.email}
          isDeleting={isDeleting}
          onConfirm={async () => {
            try {
              setIsDeleting(true);
              const response = await api.deleteUser(deletingUser.id);
              
              if (response.success) {
                if (onUserUpdate) {
                  onUserUpdate();
                }
                setDeletingUser(null);
              } else {
                console.error("Error deleting user:", response.message);
                alert(response.message || "Failed to delete user");
              }
            } catch (error) {
              console.error("Error deleting user:", error);
              alert("Failed to delete user. Please try again.");
            } finally {
              setIsDeleting(false);
            }
          }}
        />
      )}
    </div>
  );
}
