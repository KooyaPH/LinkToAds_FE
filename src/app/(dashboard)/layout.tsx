"use client";

import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/components/Sidebar/SidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#0a0a0f]">
        <Sidebar />
        <main className="flex-1 lg:ml-64">{children}</main>
      </div>
    </SidebarProvider>
  );
}

