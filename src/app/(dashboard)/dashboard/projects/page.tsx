"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "@/components/Sidebar/SidebarContext";
import { api } from "@/lib/api";

interface Project {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  ad_count: number;
  thumbnail_url: string | null;
}

export default function ProjectsPage() {
  const { open } = useSidebar();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await api.getProjects();
        if (response.success && response.data) {
          setProjects(response.data.projects);
        } else {
          setError(response.message || "Failed to fetch projects");
        }
      } catch (err) {
        setError("Failed to fetch projects");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle project deletion
  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project? This will also delete all associated ads.")) {
      return;
    }

    try {
      setDeletingId(projectId);
      const response = await api.deleteProject(projectId);
      if (response.success) {
        setProjects(projects.filter((p) => p.id !== projectId));
      } else {
        alert(response.message || "Failed to delete project");
      }
    } catch (err) {
      alert("Failed to delete project");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // Format date to display like "Jan 13, 2026"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Truncate URL for display
  const truncateUrl = (url: string | null, maxLength = 40) => {
    if (!url) return null;
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
  };

  // Get status badge styles
  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "published" || statusLower === "active") {
      return "bg-green-500/20 text-green-400";
    }
    return "bg-zinc-600/50 text-zinc-300"; // Draft/default
  };

  // Capitalize first letter
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      project.name.toLowerCase().includes(query) ||
      project.url?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query)
    );
  });

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
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-2xl font-bold text-white">My Projects</h2>
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

        {/* Search and View Toggle */}
        <div className="mb-8 flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
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
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#1a1a22] bg-[#0d1117] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#2a2a32] focus:ring-1 focus:ring-[#2a2a32]"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-[#1a1a22] bg-[#0d1117] p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-[#1a1a22] text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Grid view"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-[#1a1a22] text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="List view"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-[#1a1a22] bg-[#0d1117] px-12 py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-600 border-t-purple-500"></div>
            <p className="mt-4 text-zinc-400">Loading projects...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-red-500/20 bg-[#0d1117] px-12 py-8">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Projects Grid View */}
        {!isLoading && !error && filteredProjects.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group overflow-hidden rounded-xl border border-[#1a1a22] bg-[#0d1117] transition-all hover:border-[#2a2a32]"
              >
                {/* Thumbnail - Clickable */}
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="relative block aspect-[4/3] w-full overflow-hidden bg-[#1a1a22]"
                >
                  {project.thumbnail_url ? (
                    <Image
                      src={project.thumbnail_url}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg
                        className="h-12 w-12 text-zinc-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4">
                  {/* Name and Status */}
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="text-base font-semibold text-white line-clamp-1 hover:text-purple-400 transition-colors"
                    >
                      {project.name}
                    </Link>
                    <span
                      className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${getStatusBadge(
                        project.status
                      )}`}
                    >
                      {capitalize(project.status)}
                    </span>
                  </div>

                  {/* URL */}
                  {project.url && (
                    <p className="mb-2 text-sm text-zinc-500 line-clamp-1">
                      {truncateUrl(project.url)}
                    </p>
                  )}

                  {/* Stats */}
                  <p className="mb-4 text-sm text-zinc-400">
                    {project.ad_count} ad{project.ad_count !== 1 ? "s" : ""} •{" "}
                    {formatDate(project.created_at)}
                  </p>

                  {/* Actions - Centered within card */}
                  <div className="flex w-full items-center justify-between border-t border-[#1a1a22] pt-4 mt-4">
                    {/* External Link - Left */}
                    <a
                      href={project.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-zinc-500 transition-colors hover:text-white ${!project.url ? "pointer-events-none opacity-30" : ""}`}
                      title="Open URL"
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
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>

                    {/* Delete Button - Right */}
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingId === project.id}
                      className="text-red-500 transition-colors hover:text-red-400 disabled:opacity-50"
                      title="Delete project"
                    >
                      {deletingId === project.id ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-400 border-t-transparent"></div>
                      ) : (
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects List View */}
        {!isLoading && !error && filteredProjects.length > 0 && viewMode === "list" && (
          <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] overflow-hidden">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-[#12121a] ${
                  index !== filteredProjects.length - 1 ? "border-b border-[#1a1a22]" : ""
                }`}
              >
                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-white">
                    {project.name}
                  </h3>
                  {project.url && (
                    <p className="mt-1 text-sm text-zinc-500 truncate">
                      {project.url}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="rounded-lg border border-[#2a2a32] bg-transparent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#1a1a22]"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="text-sm font-medium text-red-500 transition-colors hover:text-red-400 disabled:opacity-50"
                  >
                    {deletingId === project.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent"></div>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results from Search */}
        {!isLoading && !error && projects.length > 0 && filteredProjects.length === 0 && (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-[#1a1a22] bg-[#0d1117] px-12 py-8">
            <svg
              className="h-12 w-12 text-zinc-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-zinc-400">No projects match &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Empty State Card */}
        {!isLoading && !error && projects.length === 0 && (
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
            <Link
              href="/dashboard/generate"
              className="rounded-lg bg-gradient-to-r from-[#5555DD] to-[#DD55DD] px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25"
            >
              Create Campaign
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
