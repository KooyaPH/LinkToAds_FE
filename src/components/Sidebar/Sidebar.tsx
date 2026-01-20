"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSidebar } from "./SidebarContext";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/projects",
    label: "My Projects",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/usage",
    label: "Usage",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/admin",
    label: "Admin",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const [userEmail, setUserEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchAdminStatus = async (userId: string) => {
      try {
        // Query Supabase directly using the user ID (works even without Supabase session)
        const { data: userData, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', userId)
          .single();
        
        if (!error && userData?.is_admin) {
          setIsAdmin(true);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error fetching admin status:", error);
        return false;
      }
    };

    const fetchUserData = async () => {
      // Try to get user from localStorage (API auth)
      const apiUser = api.getUser();
      if (apiUser?.email) {
        setUserEmail(apiUser.email);
        // Check admin status using API user ID
        if (apiUser.id) {
          await fetchAdminStatus(apiUser.id);
        } else {
          // If ID is missing, fetch current user from API
          try {
            const response = await api.getCurrentUser();
            if (response.success && response.data?.user?.id) {
              await fetchAdminStatus(response.data.user.id);
            }
          } catch (error) {
            console.error("Error fetching current user from API:", error);
          }
        }
      }

      // Also check Supabase session (for users who logged in via Supabase)
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setUserEmail(session.user.email);
          
          // Fetch admin status using Supabase session user ID
          if (session.user.id) {
            await fetchAdminStatus(session.user.id);
          }
        }
      } catch (error) {
        console.error("Error fetching Supabase session:", error);
      }
    };

    fetchUserData();

    // Listen for auth state changes (Supabase)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        
        // Fetch admin status
        if (session.user.id) {
          const isAdmin = await fetchAdminStatus(session.user.id);
          if (!isAdmin) {
            setIsAdmin(false);
          }
        }
      } else {
        // If Supabase session is cleared, check localStorage (API auth)
        const apiUser = api.getUser();
        if (apiUser?.email) {
          setUserEmail(apiUser.email);
          if (apiUser.id) {
            await fetchAdminStatus(apiUser.id);
          }
        } else {
          setUserEmail("");
          setIsAdmin(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 border-r border-[#1a1a22] bg-[#0a0a0f] flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Section */}
        <div className="flex h-[73px] items-center justify-between gap-2 px-6 border-b border-[#1a1a22]">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="LinkToAds Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="bg-gradient-to-r from-[#6666FF] to-[#FF66FF] bg-clip-text text-xl font-bold text-transparent">
              LinkToAds
            </span>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={close}
            className="lg:hidden text-white hover:text-zinc-400 transition-colors"
            aria-label="Close sidebar"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

      {/* New Campaign Button */}
      <div className="p-6">
        <Link
          href="/dashboard/generate"
          onClick={() => {
            // Close sidebar on mobile when link is clicked
            if (window.innerWidth < 1024) {
              close();
            }
          }}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#5555DD] to-[#DD55DD] px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Campaign
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4">
        <div className="space-y-1">
          {navItems
            .filter((item) => {
              // Hide admin item if user is not admin
              if (item.href === "/dashboard/admin") {
                return isAdmin;
              }
              return true;
            })
            .map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    // Close sidebar on mobile when link is clicked
                    if (window.innerWidth < 1024) {
                      close();
                    }
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#1a1a22]"
                      : "text-white hover:bg-[#12121a] hover:text-white"
                  }`}
                  style={isActive ? { color: "#684bf9" } : undefined}
                >
                  <span 
                    className="text-white"
                    style={isActive ? { color: "#684bf9" } : undefined}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-[#1a1a22] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm text-white truncate">
            {userEmail || "Loading..."}
          </span>
        </div>
        <Link
          href="/login"
          className="flex items-center gap-3 text-sm text-white transition-colors hover:text-purple-400"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log Out
        </Link>
      </div>
    </aside>
    </>
  );
}

