"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSidebar } from "@/components/Sidebar/SidebarContext";
import { api } from "@/lib/api";
import { RecentProjectCard, type Project } from "@/components/RecentProjectCard";
import { NewCampaignCard } from "@/components/NewCampaignCard";
import { LoadingSpinner } from "@/components";

// Plan display names
const PLAN_INFO: Record<string, { name: string }> = {
  starter: { name: "Starter Pack" },
  creator: { name: "Creator" },
  business: { name: "Business" },
  agency: { name: "Agency" },
};

export default function DashboardPage() {
  const { open } = useSidebar();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ campaigns: 0, adsGenerated: 0 });
  const [planData, setPlanData] = useState<{ name: string; isUnlimited: boolean }>({
    name: "Starter Pack",
    isUnlimited: false,
  });

  // Fetch projects and plan data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch projects
        const projectsResponse = await api.getProjects();
        if (projectsResponse.success && projectsResponse.data) {
          const projectsList = projectsResponse.data.projects || [];
          setProjects(projectsList);
          
          // Calculate stats
          const totalAds = projectsList.reduce((acc: number, p: Project) => acc + (p.ad_count || 0), 0);
          setStats({
            campaigns: projectsList.length,
            adsGenerated: totalAds,
          });
        }

        // Fetch plan data
        const usageResponse = await api.getUsage();
        if (usageResponse.success && usageResponse.data) {
          const { plan, monthlyLimit } = usageResponse.data;
          const planInfo = PLAN_INFO[plan] || PLAN_INFO.starter;
          const isUnlimited = monthlyLimit === -1;
          
          setPlanData({
            name: planInfo.name,
            isUnlimited,
          });
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get recent projects (up to 3)
  const recentProjects = projects.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="flex h-[73px] items-center border-b border-[#1a183e] px-8">
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
      <main className="p-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back!</h2>
            <p className="mt-1 text-zinc-400">
              Generate professional ad creatives in seconds.
            </p>
          </div>
          <Link
            href="/dashboard/generate"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#5555DD] to-[#DD55DD] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Campaign
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Campaigns Card */}
          <div className="rounded-xl border border-[#1a183e] bg-[#0d1117] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#684bf9]/20">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: "#684bf9" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.campaigns}</p>
                <p className="text-sm text-zinc-400">Campaigns</p>
              </div>
            </div>
          </div>

          {/* Ads Generated Card */}
          <div className="rounded-xl border border-[#1a183e] bg-[#0d1117] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2d1f5e]/50">
                <svg
                  className="h-5 w-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.adsGenerated}</p>
                <p className="text-sm text-zinc-400">Ads Generated</p>
              </div>
            </div>
          </div>

          {/* Current Plan Card */}
          <div className="rounded-xl border border-[#1a183e] bg-[#0d1117] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#684bf9]/20">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: "#684bf9" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-white">{planData.name}</p>
                  {planData.isUnlimited && (
                    <span className="rounded-full bg-zinc-700 px-2.5 py-0.5 text-xs font-medium text-white">
                      Unlimited
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-400">Current Plan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Recent Projects
            </h3>
            {projects.length > 0 && (
              <Link
                href="/dashboard/projects"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                View all →
              </Link>
            )}
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-[#1a183e] bg-[#0d1117] p-8">
              <LoadingSpinner size="sm" />
              <p className="mt-4 text-zinc-400">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            /* Empty State */
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-[#1a183e] bg-[#0d1117] p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a1a22]">
                <svg
                  className="h-7 w-7 text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <p className="mb-4 text-zinc-400">
                No campaigns yet. Create your first one!
              </p>
              <Link
                href="/dashboard/generate"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#5555DD] to-[#DD55DD] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Campaign
              </Link>
            </div>
          ) : (
            /* Projects Grid */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentProjects.map((project) => (
                <RecentProjectCard key={project.id} project={project} />
              ))}
              <NewCampaignCard />
            </div>
          )}
        </div>

        {/* Quick Actions Section */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Generate Ads from URL */}
            <Link
              href="/dashboard/generate"
              className="flex flex-col items-center justify-center rounded-xl border border-[#1a183e] bg-[#0d1117] p-8 transition-all hover:border-[#1a183e] hover:bg-[#12121a]"
            >
              <svg
                className="mb-3 h-6 w-6 text-[#6a4cff]"
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
              <span className="text-sm font-medium text-white">
                Generate Ads from URL
              </span>
            </Link>

            {/* Browse Projects */}
            <Link
              href="/dashboard/projects"
              className="flex flex-col items-center justify-center rounded-xl border border-[#1a183e] bg-[#0d1117] p-8 transition-all hover:border-[#1a183e] hover:bg-[#12121a]"
            >
              <svg
                className="mb-3 h-6 w-6 text-[#6a4cff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span className="text-sm font-medium text-white">
                Browse Projects
              </span>
            </Link>

            {/* View Usage */}
            <Link
              href="/dashboard/usage"
              className="flex flex-col items-center justify-center rounded-xl border border-[#1a183e] bg-[#0d1117] p-8 transition-all hover:border-[#1a183e] hover:bg-[#12121a]"
            >
              <svg
                className="mb-3 h-6 w-6 text-[#6a4cff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="text-sm font-medium text-white">View Usage</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
