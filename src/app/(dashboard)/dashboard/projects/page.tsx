"use client";

import { useSidebar } from "@/components/Sidebar/SidebarContext";

export default function ProjectsPage() {
  const { open } = useSidebar();

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
        {/* My Projects Section */}
        <div className="mb-8 flex items-start justify-between">
          <h2 className="text-2xl font-bold text-white">My Projects</h2>
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#22d3ee] via-[#a855f7] to-[#ec4899] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25">
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
          </button>
        </div>

        {/* Empty State Card */}
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-[#1a1a22] bg-[#0d1117] px-12 py-8">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-xl bg-[#1a1a22] p-4">
            <svg
              className="h-12 w-12 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">No projects yet</h3>
          <p className="mb-6 text-center text-zinc-400">
            Generate your first ad campaign to see it here.
          </p>
          <button className="rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25">
            Create Campaign
          </button>
        </div>
      </main>
    </div>
  );
}

