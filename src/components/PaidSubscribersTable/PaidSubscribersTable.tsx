"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { type User } from "@/components/AllSignUpsTable";
import EditSubscriptionModal from "@/components/EditSubscriptionModal";
import DeleteUserModal from "@/components/DeleteUserModal";

interface PaidSubscribersTableProps {
  users: User[];
  onRefresh?: () => void;
}

export default function PaidSubscribersTable({ users, onRefresh }: PaidSubscribersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState("All Plans");
  const [filterSource, setFilterSource] = useState("All Sources");
  const [sortBy, setSortBy] = useState<"joined" | "name" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter paid subscribers - only show users with 'pro', 'business', or 'agency' plans
  // Determine paid status based on plan, not just the status field
  // Users with these plans are considered paid subscribers regardless of status field value
  const paidUsers = users.filter((u: User) => {
    const paidPlans = ['creator', 'business', 'agency', 'pro'];
    // Check if user has a paid subscription plan (determines if they're a paid subscriber)
    return u.plan && paidPlans.includes(u.plan.toLowerCase());
  });
  
  // Apply filters
  const filteredPaidUsers = paidUsers.filter((user: User) => {
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        user.email.toLowerCase().includes(query) ||
        (user.name && user.name.toLowerCase().includes(query)) ||
        (user.utmSource && user.utmSource.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Plan filter
    if (filterPlan !== "All Plans") {
      if (user.plan !== filterPlan) return false;
    }

    // Source filter
    if (filterSource !== "All Sources") {
      const filterLower = filterSource.toLowerCase();
      const utmMatch = user.utmSource?.toLowerCase() === filterLower;
      const referrerMatch = user.referrer?.toLowerCase().includes(filterLower);
      if (!utmMatch && !referrerMatch) return false;
    }

    return true;
  });

  // Sort users
  const sortedUsers = [...filteredPaidUsers].sort((a: User, b: User) => {
    if (sortBy === "joined") {
      const dateA = a.joined ? new Date(a.joined).getTime() : 0;
      const dateB = b.joined ? new Date(b.joined).getTime() : 0;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (sortBy === "name") {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      return sortOrder === "asc" 
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }
    return 0;
  });

  // Get unique plans and sources for filters
  // Only show business (pro) and agency plans in the filter
  const paidPlanOptions = ['pro', 'agency', 'business'];
  const uniquePlans = Array.from(new Set(
    paidUsers
      .map((u: User) => u.plan)
      .filter((plan): plan is string => {
        return Boolean(plan) && typeof plan === 'string' && paidPlanOptions.includes(plan);
      })
  ));
  const uniqueSources = Array.from(new Set([
    ...paidUsers.map((u: User) => u.utmSource).filter(Boolean),
    ...paidUsers.map((u: User) => u.referrer).filter((r): r is string => Boolean(r) && r !== 'direct')
  ])) as string[];

  return (
    <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] overflow-hidden">
      {/* Header Section */}
      <div className="border-b border-[#1a1a22] p-6">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Paid Subscribers
            <span className="ml-2 text-zinc-400 font-normal">({paidUsers.length})</span>
          </h3>
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg hover:bg-[#1a1a22] transition-colors"
            title="Refresh"
          >
            <svg
              className="h-5 w-5 text-zinc-400"
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

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search email, name, campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg bg-[#050509] border border-[#1a1a22] text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#6d28d9] text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500"
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
          </div>

          {/* Plan Filter */}
          <div className="relative">
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-4 py-2 pr-8 rounded-lg bg-[#050509] border border-[#1a1a22] text-white text-sm focus:outline-none focus:border-[#6d28d9] appearance-none cursor-pointer"
            >
              <option value="All Plans">All Plans</option>
              {uniquePlans.map((plan: string) => (
                <option key={plan} value={plan}>{plan}</option>
              ))}
            </select>
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none"
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

          {/* Source Filter */}
          <div className="relative">
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-4 py-2 pr-8 rounded-lg bg-[#050509] border border-[#1a1a22] text-white text-sm focus:outline-none focus:border-[#6d28d9] appearance-none cursor-pointer"
            >
              <option value="All Sources">All Sources</option>
              {uniqueSources.map((source: string) => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none"
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
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a22]">
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Campaigns</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">UTM Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">UTM Campaign</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => {
                  if (sortBy === "joined") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("joined");
                    setSortOrder("desc");
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  Joined
                  {sortBy === "joined" && (
                    <svg
                      className={`h-4 w-4 ${sortOrder === "asc" ? "transform rotate-180" : ""}`}
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
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a22]">
            {sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="h-12 w-12 text-zinc-600 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-zinc-400 text-sm">No paid subscribers found</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedUsers.map((user: User) => (
                <tr key={user.id} className="hover:bg-[#1a1a22] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.name || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.plan || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{user.utmSource || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                    {user.joined ? new Date(user.joined).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-zinc-400 hover:text-white transition-colors"
                        aria-label="Edit"
                        title="Edit subscription"
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
                        title="Delete user"
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
              ))
            )}
          </tbody>
        </table>
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
            if (onRefresh) {
              onRefresh();
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
                if (onRefresh) {
                  onRefresh();
                }
                setDeletingUser(null);
              } else {
                console.error("Failed to delete user:", response.message);
              }
            } catch (error) {
              console.error("Error deleting user:", error);
            } finally {
              setIsDeleting(false);
            }
          }}
        />
      )}
    </div>
  );
}
