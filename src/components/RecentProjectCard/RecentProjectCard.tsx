"use client";

import Link from "next/link";
import Image from "next/image";

export interface Project {
  id: string;
  name: string;
  url: string | null;
  status: string;
  created_at: string;
  ad_count: number;
  thumbnail_url: string | null;
}

interface RecentProjectCardProps {
  project: Project;
}

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Truncate URL helper
const truncateUrl = (url: string, maxLength: number = 50) => {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + "...";
};

export default function RecentProjectCard({ project }: RecentProjectCardProps) {
  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="group block overflow-hidden rounded-xl border border-[#1a1a22] bg-[#0d1117] transition-all hover:border-[#2a2a32]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1a1a22]">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-16 w-16 text-zinc-600"
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
      </div>

      {/* Project Info */}
      <div className="p-5">
        <h4 className="text-base font-semibold text-white truncate">
          {project.name}
        </h4>
        {project.url && (
          <p className="mt-1.5 text-sm text-zinc-500 truncate">
            {truncateUrl(project.url)}
          </p>
        )}
        <p className="mt-2 text-sm text-zinc-500">
          {formatDate(project.created_at)}
        </p>
      </div>
    </Link>
  );
}
