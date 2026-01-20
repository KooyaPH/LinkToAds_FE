"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";

interface UrlAttempt {
  id: string;
  email: string | null;
  url: string;
  stage: string;
  status: string;
  error_message: string | null;
  created_at: string;
}

export default function UrlAttemptsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState("All Stages");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [urlAttempts, setUrlAttempts] = useState<UrlAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [stageOpen, setStageOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const stages = ["Scrape", "Generate", "Complete"];
  const statuses = ["Success", "Error", "Pending"];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stageRef.current && !stageRef.current.contains(event.target as Node)) {
        setStageOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUrlAttempts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.getUrlAttempts({
        search: searchQuery || undefined,
        stage: filterStage !== "All Stages" ? filterStage : undefined,
        status: filterStatus !== "All Status" ? filterStatus : undefined,
        limit: 100,
        offset: 0,
      });

      if (response.success && response.data) {
        setUrlAttempts(response.data.attempts || []);
        setTotalAttempts(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching URL attempts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filterStage, filterStatus]);

  useEffect(() => {
    fetchUrlAttempts();
  }, [fetchUrlAttempts]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `about ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes < 1 ? 'just now' : `about ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#1a1a22] p-6">
        <div className="flex items-center gap-3 mb-2">
          <svg
            className="h-6 w-6 text-white"
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
          <h3 className="text-lg font-semibold text-white">URL Generation Attempts</h3>
          <span className="rounded-full bg-[#1a1a22] px-2.5 py-0.5 text-xs font-medium text-white">
            {totalAttempts} total
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="border-b border-[#1a1a22] p-6">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          {/* Search */}
          <div className="flex-1 relative w-full md:w-auto">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400"
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
              placeholder="Search URL or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#1a1a22] bg-[#0a0a0f] text-sm text-white placeholder-zinc-500 focus:border-[#684bf9] focus:outline-none"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-3">
            {/* Stage Filter */}
            <div className="relative" ref={stageRef}>
              <button
                type="button"
                onClick={() => {
                  setStageOpen(!stageOpen);
                  setStatusOpen(false);
                }}
                className="w-[140px] text-left rounded-lg border border-[#1a1a22] bg-[#0a0a0f] px-4 py-2.5 pr-10 text-sm text-white focus:border-[#684bf9] focus:outline-none cursor-pointer"
              >
                <span className={filterStage ? "" : "text-zinc-500"}>
                  {filterStage}
                </span>
                <svg
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none transition-transform ${
                    stageOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="#6348f0"
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
              {stageOpen && (
                <div className="absolute z-[100] w-full mt-1 rounded-lg border border-[#1a1a22] bg-[#0a0a0f] shadow-xl overflow-hidden max-h-[200px] overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterStage("All Stages");
                      setStageOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm text-white transition-colors flex items-center gap-2 ${
                      filterStage === "All Stages"
                        ? "bg-[#c34cff]"
                        : "hover:bg-[#1a1a22]"
                    }`}
                  >
                    {filterStage === "All Stages" && (
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
                    <span>All Stages</span>
                  </button>
                  {stages.map((stage) => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => {
                        setFilterStage(stage);
                        setStageOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm text-white transition-colors flex items-center gap-2 ${
                        filterStage === stage
                          ? "bg-[#c34cff]"
                          : "hover:bg-[#1a1a22]"
                      }`}
                    >
                      {filterStage === stage && (
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
                      <span>{stage}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative" ref={statusRef}>
              <button
                type="button"
                onClick={() => {
                  setStatusOpen(!statusOpen);
                  setStageOpen(false);
                }}
                className="w-[140px] text-left rounded-lg border border-[#1a1a22] bg-[#0a0a0f] px-4 py-2.5 pr-10 text-sm text-white focus:border-[#684bf9] focus:outline-none cursor-pointer"
              >
                <span className={filterStatus ? "" : "text-zinc-500"}>
                  {filterStatus}
                </span>
                <svg
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none transition-transform ${
                    statusOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="#6348f0"
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
              {statusOpen && (
                <div className="absolute z-[100] w-full mt-1 rounded-lg border border-[#1a1a22] bg-[#0a0a0f] shadow-xl overflow-hidden max-h-[200px] overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterStatus("All Status");
                      setStatusOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm text-white transition-colors flex items-center gap-2 ${
                      filterStatus === "All Status"
                        ? "bg-[#c34cff]"
                        : "hover:bg-[#1a1a22]"
                    }`}
                  >
                    {filterStatus === "All Status" && (
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
                    <span>All Status</span>
                  </button>
                  {statuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setFilterStatus(status);
                        setStatusOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm text-white transition-colors flex items-center gap-2 ${
                        filterStatus === status
                          ? "bg-[#c34cff]"
                          : "hover:bg-[#1a1a22]"
                      }`}
                    >
                      {filterStatus === status && (
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
                      <span>{status}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={fetchUrlAttempts}
              className="px-4 py-2 rounded-lg bg-[#6348f0] text-white text-sm font-medium hover:bg-[#5538d0] transition-colors"
            >
              Search
            </button>

            {/* Refresh Button */}
            <button
              onClick={fetchUrlAttempts}
              disabled={isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1a1a22] bg-[#0a0a0f] text-zinc-400 transition-colors hover:bg-[#1a1a22] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[#1a1a22] bg-[#0a0a0f]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                URL
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-400">
                Stage
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                Error
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a22]">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-zinc-400">
                  Loading URL attempts...
                </td>
              </tr>
            ) : urlAttempts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-zinc-400">
                  No URL attempts found
                </td>
              </tr>
            ) : (
              urlAttempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-[#12121a] transition-colors">
                  <td className="px-6 py-4 text-sm text-white">
                    {attempt.email || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <a
                      href={attempt.url.startsWith('http') ? attempt.url : `https://${attempt.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80"
                      style={{ color: '#1a49c8' }}
                      title={attempt.url}
                    >
                      {attempt.url.length > 40 
                        ? `${attempt.url.substring(0, 40)}...` 
                        : attempt.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    {(() => {
                      const stage = (attempt.stage || '').toLowerCase();
                      
                      if (stage === 'scrape') {
                        return (
                          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-900">
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
                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                              />
                            </svg>
                            Scrape
                          </span>
                        );
                      } else if (stage === 'generate') {
                        return (
                          <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700">
                            <svg
                              className="h-4 w-4 transform rotate-[-30deg]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </svg>
                            Generate
                          </span>
                        );
                      } else if (stage === 'complete') {
                        return (
                          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700">
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Complete
                          </span>
                        );
                      } else {
                        // Fallback for unknown stages
                        return (
                          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
                            {attempt.stage || 'Unknown'}
                          </span>
                        );
                      }
                    })()}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    {attempt.status === "success" || attempt.status === "Success" ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-sm font-bold text-green-600">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4"
                          />
                        </svg>
                        Success
                      </span>
                    ) : attempt.status === "error" || attempt.status === "Error" || attempt.status === "Failed" ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-sm font-bold text-red-600">
                        Error
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1.5 text-sm font-bold text-yellow-600">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-red-500">
                    {attempt.error_message || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {formatTimeAgo(attempt.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
