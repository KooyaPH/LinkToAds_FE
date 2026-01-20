"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import ConfirmCampaignModal from "./ConfirmCampaignModal";

interface EmailLog {
  id: string;
  recipient_email: string;
  recipient_name: string | null;
  email_type: string;
  subject: string;
  status: string;
  sent_at: string | null;
  error_message: string | null;
  user_id: string | null;
  created_at: string;
}

export default function EmailCampaign() {
  const [emailType, setEmailType] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [emailTypeOpen, setEmailTypeOpen] = useState(false);
  const [targetAudienceOpen, setTargetAudienceOpen] = useState(false);
  const emailTypeRef = useRef<HTMLDivElement>(null);
  const targetAudienceRef = useRef<HTMLDivElement>(null);
  const filterTypeRef = useRef<HTMLDivElement>(null);
  const filterStatusRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTypeOpen, setFilterTypeOpen] = useState(false);
  const [filterStatusOpen, setFilterStatusOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendMessage, setSendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [totalLogs, setTotalLogs] = useState(0);
  const [stats, setStats] = useState({
    sentToday: 0,
    sentThisWeek: 0,
    failedThisWeek: 0,
    successRate: "0.0",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [recipientCount, setRecipientCount] = useState(0);
  const [isLoadingRecipientCount, setIsLoadingRecipientCount] = useState(false);

  // Calculate stats from email logs as fallback/verification
  const calculateStatsFromLogs = (logs: EmailLog[]) => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const sentToday = logs.filter(log => {
      const date = log.sent_at ? new Date(log.sent_at) : new Date(log.created_at);
      return date >= today && log.status === 'sent';
    }).length;

    const weekLogs = logs.filter(log => {
      const date = log.sent_at ? new Date(log.sent_at) : new Date(log.created_at);
      return date >= weekAgo;
    });

    const sentThisWeek = weekLogs.filter(log => log.status === 'sent').length;
    const failedThisWeek = weekLogs.filter(log => log.status === 'failed').length;
    const totalThisWeek = weekLogs.length;
    const successRate = totalThisWeek > 0 ? ((sentThisWeek / totalThisWeek) * 100).toFixed(1) : '0.0';

    return {
      sentToday,
      sentThisWeek,
      failedThisWeek,
      successRate,
    };
  };

  const emailTypes = [
    { value: "special-offer", label: "Special Offer" },
    { value: "feature-highlight", label: "Feature Highlight" },
    { value: "upgrade-nudge", label: "Upgrade Nudge" },
    { value: "referral-invite", label: "Referral Invite" },
  ];

  const targetAudiences = [
    { value: "all", label: "All Users" },
    { value: "free", label: "Free Users Only" },
    { value: "paid", label: "Paid Users Only" },
    { value: "inactive", label: "Inactive Users" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emailTypeRef.current && !emailTypeRef.current.contains(event.target as Node)) {
        setEmailTypeOpen(false);
      }
      if (targetAudienceRef.current && !targetAudienceRef.current.contains(event.target as Node)) {
        setTargetAudienceOpen(false);
      }
      if (filterTypeRef.current && !filterTypeRef.current.contains(event.target as Node)) {
        setFilterTypeOpen(false);
      }
      if (filterStatusRef.current && !filterStatusRef.current.contains(event.target as Node)) {
        setFilterStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch email logs
  const fetchEmailLogs = useCallback(async () => {
    setIsLoadingLogs(true);
    try {
      const response = await api.getEmailLogs({
        search: searchQuery || undefined,
        emailType: filterType !== "All Types" ? filterType : undefined,
        status: filterStatus !== "All" ? filterStatus : undefined,
        limit: 100,
        offset: 0,
      });

      if (response.success && response.data) {
        setEmailLogs(response.data.logs);
        setTotalLogs(response.data.total);
        // Use stats from API, or calculate from logs if stats not available
        if (response.data.stats) {
          setStats(response.data.stats);
        } else {
          // Fallback: calculate from logs
          const calculatedStats = calculateStatsFromLogs(response.data.logs);
          setStats(calculatedStats);
        }
      }
    } catch (error) {
      console.error('Error fetching email logs:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  }, [searchQuery, filterType, filterStatus]);

  // Fetch logs on mount and when filters change
  useEffect(() => {
    fetchEmailLogs();
  }, [fetchEmailLogs]);

  // Handle preview/send button click - show confirmation modal
  const handlePreviewAndSend = async () => {
    if (!emailType || !targetAudience) {
      setSendMessage({ type: 'error', text: 'Please select email type and target audience' });
      return;
    }

    // Fetch recipient count
    setIsLoadingRecipientCount(true);
    try {
      const countResponse = await api.getRecipientCount(targetAudience);
      if (countResponse.success && countResponse.data) {
        setRecipientCount(countResponse.data.count || 0);
        setShowConfirmModal(true);
      } else {
        setSendMessage({
          type: 'error',
          text: 'Failed to get recipient count',
        });
      }
    } catch (error) {
      console.error('Error fetching recipient count:', error);
      setSendMessage({
        type: 'error',
        text: 'Failed to get recipient count',
      });
    } finally {
      setIsLoadingRecipientCount(false);
    }
  };

  // Handle confirmed send campaign
  const handleSendCampaign = async () => {
    setIsSending(true);
    setSendMessage(null);
    setShowConfirmModal(false);

    try {
      const response = await api.sendEmailCampaign({
        emailType,
        targetAudience,
        subject: undefined, // Can be customized later
        customMessage: undefined, // Can be customized later
      });

      if (response.success) {
        setSendMessage({
          type: 'success',
          text: `Campaign sent successfully! ${response.data?.sent || 0} emails sent, ${response.data?.failed || 0} failed.`,
        });
        // Refresh email logs after successful send
        await fetchEmailLogs();
        // Clear form after successful send
        setTimeout(() => {
          setEmailType("");
          setTargetAudience("");
          setSendMessage(null);
        }, 3000);
      } else {
        setSendMessage({
          type: 'error',
          text: response.message || 'Failed to send campaign',
        });
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      setSendMessage({
        type: 'error',
        text: 'An error occurred while sending the campaign',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sent Today */}
        <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] p-4">
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="h-5 w-5 text-zinc-400 transform rotate-[30deg]"
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
            <span className="text-sm text-zinc-400">Sent Today</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.sentToday}</p>
        </div>

        {/* This Week */}
        <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] p-4">
          <div className="flex items-center gap-3 mb-2">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-zinc-400">This Week</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.sentThisWeek}</p>
        </div>

        {/* Success Rate */}
        <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] p-4">
          <div className="flex items-center gap-3 mb-2">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-zinc-400">Success Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-500">{stats.successRate}%</p>
        </div>

        {/* Failed */}
        <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117] p-4">
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="h-5 w-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-zinc-400">Failed</span>
          </div>
          <p className="text-2xl font-bold text-red-500">{stats.failedThisWeek}</p>
        </div>
      </div>

      {/* Send Campaign Panel */}
      <div className="rounded-xl border border-[#1a1a22] bg-[#0d1117]">
        <div className="p-6 overflow-visible">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="#6348f0"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-white">Send Campaign</h3>
          </div>
          <p className="text-sm text-zinc-400 ml-9 mb-6">Send promotional emails to your users</p>

          {/* Form - Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Email Type */}
            <div className="relative">
              <label className="block text-sm font-medium text-white mb-2">
                Email Type
              </label>
              <div className="relative" ref={emailTypeRef}>
                <button
                  type="button"
                  onClick={() => {
                    setEmailTypeOpen(!emailTypeOpen);
                    setTargetAudienceOpen(false);
                  }}
                  className="w-full text-left rounded-lg border border-[#1a1a22] bg-[#0a0a0f] px-4 py-3 pr-10 text-sm text-white focus:border-[#684bf9] focus:outline-none cursor-pointer"
                >
                  <span className={emailType ? "" : "text-zinc-500"}>
                    {emailType
                      ? emailTypes.find((t) => t.value === emailType)?.label
                      : "Select email type"}
                  </span>
                  <svg
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none transition-transform ${
                      emailTypeOpen ? "rotate-180" : ""
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
                {emailTypeOpen && (
                  <div className="absolute z-[100] w-full mt-1 rounded-lg border border-[#1a1a22] bg-[#0a0a0f] shadow-xl overflow-hidden max-h-[200px] overflow-y-auto">
                    {emailTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setEmailType(type.value);
                          setEmailTypeOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm text-white transition-colors ${
                          emailType === type.value
                            ? "bg-[#c34cff]"
                            : "hover:bg-[#1a1a22]"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Target Audience */}
            <div className="relative">
              <label className="block text-sm font-medium text-white mb-2">
                Target Audience
              </label>
              <div className="relative" ref={targetAudienceRef}>
                <button
                  type="button"
                  onClick={() => {
                    setTargetAudienceOpen(!targetAudienceOpen);
                    setEmailTypeOpen(false);
                  }}
                  className="w-full text-left rounded-lg border border-[#1a1a22] bg-[#0a0a0f] px-4 py-3 pr-10 text-sm text-white focus:border-[#684bf9] focus:outline-none cursor-pointer"
                >
                  <span className={targetAudience ? "" : "text-zinc-500"}>
                    {targetAudience
                      ? targetAudiences.find((a) => a.value === targetAudience)?.label
                      : "Select audience"}
                  </span>
                  <svg
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none transition-transform ${
                      targetAudienceOpen ? "rotate-180" : ""
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
                {targetAudienceOpen && (
                  <div className="absolute z-[100] w-full mt-1 rounded-lg border border-[#1a1a22] bg-[#0a0a0f] shadow-xl overflow-hidden max-h-[200px] overflow-y-auto">
                    {targetAudiences.map((audience) => (
                      <button
                        key={audience.value}
                        type="button"
                        onClick={() => {
                          setTargetAudience(audience.value);
                          setTargetAudienceOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm text-white transition-colors ${
                          targetAudience === audience.value
                            ? "bg-[#c34cff]"
                            : "hover:bg-[#1a1a22]"
                        }`}
                      >
                        {audience.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview & Send Button - Bottom Left */}
          <div className="flex items-start gap-4 mt-4">
            <button
              onClick={handlePreviewAndSend}
              disabled={!emailType || !targetAudience || isSending || isLoadingRecipientCount}
              className="inline-flex items-center gap-2 rounded-lg bg-[#6348f0] px-6 py-3 text-white font-medium transition-all hover:bg-[#5538d0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingRecipientCount ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
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
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5 transform rotate-[30deg]"
                    fill="none"
                    stroke="white"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  <span>Preview & Send</span>
                </>
              )}
            </button>
            {sendMessage && (
              <p className={`text-sm pt-3 ${sendMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {sendMessage.text}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Campaign Modal */}
      <ConfirmCampaignModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSendCampaign}
        emailType={emailType}
        targetAudience={targetAudience}
        recipientCount={recipientCount}
        isSending={isSending}
      />
    
    {/* Email Logs Table Section */}
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-white">Email Logs</h3>
            <span className="rounded-full bg-[#1a1a22] px-2.5 py-0.5 text-xs font-medium text-white">
              {totalLogs} total
            </span>
          </div>
          <p className="text-sm text-zinc-400 ml-9">View all sent emails and their delivery status</p>
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
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#1a1a22] bg-[#0a0a0f] text-sm text-white placeholder-zinc-500 focus:border-[#684bf9] focus:outline-none"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-3">
              {/* Type Filter */}
              <div ref={filterTypeRef} className="relative">
                <button
                  type="button"
                  onClick={() => setFilterTypeOpen(!filterTypeOpen)}
                  className="flex items-center justify-between w-40 px-4 py-2 rounded-lg border border-[#1a1a22] bg-[#0a0a0f] text-sm font-medium text-white hover:bg-[#1a1a22] transition-colors"
                >
                  <span>{filterType}</span>
                  <svg
                    className={`h-4 w-4 text-white transition-transform ${filterTypeOpen ? 'rotate-180' : ''}`}
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
                {filterTypeOpen && (
                  <div className="absolute z-[100] w-full mt-1 rounded-lg border border-[#1a1a22] bg-[#0a0a0f] shadow-xl overflow-hidden">
                    {["All Types", "special-offer", "feature-highlight", "upgrade-nudge", "referral-invite"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setFilterType(type);
                          setFilterTypeOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm text-white transition-colors flex items-center gap-2 ${
                          filterType === type
                            ? "bg-[#c34cff]"
                            : "hover:bg-[#1a1a22]"
                        }`}
                      >
                        {filterType === type && (
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
                        <span>{type === "special-offer" ? "Special Offer" : type === "feature-highlight" ? "Feature Highlight" : type === "upgrade-nudge" ? "Upgrade Nudge" : type === "referral-invite" ? "Referral Invite" : type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div ref={filterStatusRef} className="relative">
                <button
                  type="button"
                  onClick={() => setFilterStatusOpen(!filterStatusOpen)}
                  className="flex items-center justify-between w-32 px-4 py-2 rounded-lg border border-[#1a1a22] bg-[#0a0a0f] text-sm font-medium text-white hover:bg-[#1a1a22] transition-colors"
                >
                  <span>{filterStatus}</span>
                  <svg
                    className={`h-4 w-4 text-white transition-transform ${filterStatusOpen ? 'rotate-180' : ''}`}
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
                {filterStatusOpen && (
                  <div className="absolute z-[100] w-full mt-1 rounded-lg border border-[#1a1a22] bg-[#0a0a0f] shadow-xl overflow-hidden">
                    {["All", "Sent", "Failed", "Pending"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => {
                          setFilterStatus(status);
                          setFilterStatusOpen(false);
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

              {/* Refresh Button */}
              <button 
                onClick={fetchEmailLogs}
                disabled={isLoadingLogs}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1a1a22] bg-[#0a0a0f] text-zinc-400 transition-colors hover:bg-[#1a1a22] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className={`h-5 w-5 ${isLoadingLogs ? 'animate-spin' : ''}`}
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
                  Recipient
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Sent At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Error
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a22]">
              {isLoadingLogs ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-zinc-400">
                    Loading email logs...
                  </td>
                </tr>
              ) : emailLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-zinc-400">
                    No email logs found
                  </td>
                </tr>
              ) : (
                emailLogs.map((log) => {
                  const formatEmailType = (type: string) => {
                    return type
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                  };

                  const formatDate = (dateString: string | null) => {
                    if (!dateString) return '—';
                    const date = new Date(dateString);
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const month = months[date.getMonth()];
                    const day = date.getDate();
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    return `${month} ${day}, ${hours}:${minutes}`;
                  };

                  return (
                    <tr key={log.id} className="hover:bg-[#12121a] transition-colors">
                      <td className="px-6 py-4 text-sm text-white">
                        {log.recipient_name ? (
                          <div>
                            <div>{log.recipient_email}</div>
                            <div className="text-zinc-400 text-xs mt-0.5">{log.recipient_name}</div>
                          </div>
                        ) : (
                          log.recipient_email
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className="inline-flex items-center rounded-full bg-[#1a1a22] px-3 py-1.5 text-sm font-medium text-white border border-[#2a2a32]">
                          {formatEmailType(log.email_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {log.subject}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {log.status === 'sent' ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-600">
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
                            Sent
                          </span>
                        ) : log.status === 'failed' ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600">
                            Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-600">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {formatDate(log.sent_at || log.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-500">
                        {log.error_message || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
