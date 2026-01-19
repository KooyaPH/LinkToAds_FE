"use client";

import { useState, useEffect } from "react";
import { useSidebar } from "@/components/Sidebar/SidebarContext";
import AllSignUpsTable, { type User } from "@/components/AllSignUpsTable";
import AdminUsersTable from "@/components/AdminUsersTable";
import { api } from "@/lib/api";

export default function AdminPage() {
  const { open } = useSidebar();
  const [selectedTab, setSelectedTab] = useState("all-signups");
  const [users, setUsers] = useState<User[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminCount, setAdminCount] = useState(0);
  const [totalAds, setTotalAds] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [adsThisWeek, setAdsThisWeek] = useState(0);
  const [adsThisMonth, setAdsThisMonth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users from database
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.getAdminUsers();
      if (response.success && response.data?.users) {
        setUsers(response.data.users);
      } else {
        console.error("Failed to fetch users:", response.message);
      }

      // Fetch admin users count
      const adminResponse = await api.getAdminOnlyUsers();
      if (adminResponse.success && adminResponse.data?.users) {
        setAdminUsers(adminResponse.data.users);
        setAdminCount(adminResponse.data.users.length);
      } else {
        console.error("Failed to fetch admin users:", adminResponse.message);
      }

      // Fetch admin stats (total ads count, projects count, weekly and monthly counts)
      const statsResponse = await api.getAdminStats();
      if (statsResponse.success && statsResponse.data) {
        if (statsResponse.data.totalAds !== undefined) {
          setTotalAds(statsResponse.data.totalAds);
        }
        if (statsResponse.data.totalProjects !== undefined) {
          setTotalProjects(statsResponse.data.totalProjects);
        }
        if (statsResponse.data.adsThisWeek !== undefined) {
          setAdsThisWeek(statsResponse.data.adsThisWeek);
        }
        if (statsResponse.data.adsThisMonth !== undefined) {
          setAdsThisMonth(statsResponse.data.adsThisMonth);
        }
      } else {
        console.error("Failed to fetch admin stats:", statsResponse.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="flex h-[73px] items-center border-b border-[#1a1a22] px-8">
        <button
          onClick={open}
          className="lg:hidden mr-4 text-white hover:text-zinc-400 transition-colors"
          aria-label="Open sidebar"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-white">Ad Generator</h1>
      </header>

      {/* Main Content */}
      <main className="px-12 py-8 lg:px-16">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Admin</h2>
          <p className="mt-1 text-zinc-400">
          Manage users and view analytics
          </p>
        </div>

        {/* Analytics */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {/* Total Users */}
            <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] p-4">
              <div className="flex items-center gap-2 mb-2">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="text-sm text-zinc-400">Total Users</span>
              </div>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>

            {/* Free */}
            <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] p-4">
              <div className="mb-2">
                <span className="text-sm text-zinc-400">Free</span>
              </div>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'Free').length}</p>
            </div>

            {/* Paid */}
            <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-sm text-zinc-400">Paid</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{users.filter(u => u.status === 'Paid').length}</p>
            </div>

            {/* Conversion */}
            <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] p-4">
              <div className="mb-2">
                <span className="text-sm text-zinc-400">Conversion</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {users.length > 0 
                  ? `${Math.round((users.filter(u => u.status === 'Paid').length / users.length) * 100)}%`
                  : '0%'}
              </p>
            </div>

            {/* Total Ads */}
            <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] p-4">
              <div className="flex items-center gap-2 mb-2">
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
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
                <span className="text-sm text-zinc-400">Total Ads</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalAds}</p>
            </div>

            {/* Campaigns */}
            <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] p-4">
              <div className="flex items-center gap-2 mb-2">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-zinc-400">Campaigns</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalProjects}</p>
            </div>

            {/* This Week */}
            <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-zinc-400">This Week</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">{adsThisWeek}</p>
            </div>

            {/* This Month */}
            <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] p-4">
              <div className="mb-2">
                <span className="text-sm text-zinc-400">This Month</span>
              </div>
              <p className="text-2xl font-bold text-white">{adsThisMonth}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex items-center gap-1 rounded-xl border border-[#1a1a22] bg-[#0d1117] p-2 overflow-x-auto">
            {/* All Sign-ups */}
            <button
              onClick={() => setSelectedTab("all-signups")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 transition-all whitespace-nowrap ${
                selectedTab === "all-signups"
                  ? "bg-[#1a1a22] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <span className="text-sm font-medium">All Sign-ups</span>
              <span className="text-sm font-bold ml-1">{users.length}</span>
            </button>

            {/* Subscribers (Paid) */}
            <button
              onClick={() => setSelectedTab("subscribers")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 transition-all whitespace-nowrap ${
                selectedTab === "subscribers"
                  ? "bg-[#1a1a22] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
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
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="text-sm font-medium">Subscribers (Paid)</span>
              <span className="text-sm font-bold ml-1">0</span>
            </button>

            {/* Emails */}
            <button
              onClick={() => setSelectedTab("emails")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 transition-all whitespace-nowrap ${
                selectedTab === "emails"
                  ? "bg-[#1a1a22] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium">Emails</span>
              <span className="text-sm font-bold ml-1">0</span>
            </button>

            {/* Admins */}
            <button
              onClick={() => setSelectedTab("admins")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 transition-all whitespace-nowrap ${
                selectedTab === "admins"
                  ? "bg-[#1a1a22] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
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
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <span className="text-sm font-medium">Admins</span>
              <span className="text-sm font-bold ml-1">{adminCount}</span>
            </button>

            {/* URL Attempts */}
            <button
              onClick={() => setSelectedTab("url-attempts")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 transition-all whitespace-nowrap ${
                selectedTab === "url-attempts"
                  ? "bg-[#1a1a22] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
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
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              <span className="text-sm font-medium">URL Attempts</span>
              <span className="text-sm font-bold ml-1">0</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-zinc-400">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading users...
            </div>
          </div>
        )}

        {/* All Sign-ups */}
        {!isLoading && selectedTab === "all-signups" && (
          <AllSignUpsTable users={users} onUserUpdate={fetchUsers} />
        )}

        {/* Admin Users */}
        {!isLoading && selectedTab === "admins" && (
          <AdminUsersTable onUserDelete={fetchUsers} />
        )}
      </main>
    </div>
  );
}
