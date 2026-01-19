"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSidebar } from "@/components/Sidebar/SidebarContext";
import { api } from "@/lib/api";
import { ProjectAdsGrid, AdLightbox, Ad } from "@/components/ProjectAds";

interface Project {
  id: string;
  name: string;
  description?: string | null;
  url?: string | null;
  usp?: string | null;
  target_audience?: string | null;
  current_offer?: string | null;
  brand_tone?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  ads: Ad[];
}

export default function ProjectDetailPage() {
  const { open } = useSidebar();
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [deletingAdId, setDeletingAdId] = useState<string | null>(null);

  // Fetch project on mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const response = await api.getProject(projectId);
        if (response.success && response.data) {
          setProject(response.data.project);
        } else {
          setError(response.message || "Failed to fetch project");
        }
      } catch (err) {
        setError("Failed to fetch project");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle download
  const handleDownload = (ad: Ad) => {
    const link = document.createElement("a");
    link.href = ad.image_url;
    link.download = `${ad.title || "ad"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle download all
  const handleDownloadAll = () => {
    if (!project) return;
    project.ads.forEach((ad, index) => {
      setTimeout(() => {
        handleDownload(ad);
      }, index * 500);
    });
  };

  // Handle delete ad
  const handleDeleteAd = async (ad: Ad) => {
    if (!confirm(`Are you sure you want to delete "${ad.title}"?`)) {
      return;
    }

    try {
      setDeletingAdId(ad.id);
      const response = await api.deleteAd(ad.id);
      if (response.success && project) {
        setProject({
          ...project,
          ads: project.ads.filter((a) => a.id !== ad.id),
        });
      } else {
        alert(response.message || "Failed to delete ad");
      }
    } catch (err) {
      alert("Failed to delete ad");
      console.error(err);
    } finally {
      setDeletingAdId(null);
    }
  };

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
        {/* Back Button */}
        <Link
          href="/dashboard/projects"
          className="mb-6 inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </Link>

        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-[#1a1a22] bg-[#0d1117] px-12 py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-600 border-t-purple-500"></div>
            <p className="mt-4 text-zinc-400">Loading project...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-red-500/20 bg-[#0d1117] px-12 py-8">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => router.push("/dashboard/projects")}
              className="mt-4 rounded-lg bg-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-600"
            >
              Go Back
            </button>
          </div>
        )}

        {/* Project Content */}
        {!isLoading && !error && project && (
          <>
            {/* Project Header */}
            <div className="mb-8">
              {/* Title Row */}
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                <span className="inline-flex items-center rounded-full bg-zinc-700/50 px-3 py-1 text-xs font-medium text-zinc-300 capitalize">
                  {project.status}
                </span>
              </div>

              {/* URL */}
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-purple-400 transition-colors"
                >
                  {project.url}
                </a>
              )}

              {/* Strategy Analysis Card */}
              {(project.usp || project.target_audience || project.current_offer || project.brand_tone) && (
                <div className="mt-6 rounded-xl border border-[#1a1a22] bg-[#0d1117] p-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">Strategy Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* USP */}
                    {project.usp && (
                      <div>
                        <p className="text-[11px] sm:text-xs text-zinc-400 uppercase tracking-[0.18em] mb-1.5">
                          USP
                        </p>
                        <p className="text-sm sm:text-base text-zinc-100 leading-relaxed sm:leading-7">
                          {project.usp}
                        </p>
                      </div>
                    )}

                    {/* Target Audience */}
                    {project.target_audience && (
                      <div>
                        <p className="text-[11px] sm:text-xs text-zinc-400 uppercase tracking-[0.18em] mb-1.5">
                          Target Audience
                        </p>
                        <p className="text-sm sm:text-base text-zinc-100 leading-relaxed sm:leading-7">
                          {project.target_audience}
                        </p>
                      </div>
                    )}

                    {/* Current Offer */}
                    {project.current_offer && (
                      <div>
                        <p className="text-[11px] sm:text-xs text-zinc-400 uppercase tracking-[0.18em] mb-1.5">
                          Current Offer
                        </p>
                        <p className="text-sm sm:text-base text-zinc-100 leading-relaxed sm:leading-7">
                          {project.current_offer}
                        </p>
                      </div>
                    )}

                    {/* Brand Tone */}
                    {project.brand_tone && (
                      <div>
                        <p className="text-[11px] sm:text-xs text-zinc-400 uppercase tracking-[0.18em] mb-1.5">
                          Brand Tone
                        </p>
                        <p className="text-sm sm:text-base text-zinc-100 leading-relaxed sm:leading-7">
                          {project.brand_tone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stats Row */}
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-zinc-500">
                  {project.ads.length} ad{project.ads.length !== 1 ? "s" : ""} •
                  Created {formatDate(project.created_at)}
                </p>
                <button
                  onClick={handleDownloadAll}
                  disabled={project.ads.length === 0}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#5555DD] to-[#DD55DD] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download All
                </button>
              </div>
            </div>

            <div className="mt-12 mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-white">
                Generated Ads ({project.ads.length})
              </h3>
            </div>

            {/* Ads Grid */}
            <ProjectAdsGrid
              ads={project.ads}
              onView={setSelectedAd}
              onDownload={handleDownload}
              onDelete={handleDeleteAd}
              formatDate={formatDate}
              deletingAdId={deletingAdId}
              brandName={project.name}
            />
          </>
        )}
      </main>

      {/* Lightbox Modal */}
      <AdLightbox
        ad={selectedAd}
        onClose={() => setSelectedAd(null)}
        onDownload={handleDownload}
      />
    </div>
  );
}
