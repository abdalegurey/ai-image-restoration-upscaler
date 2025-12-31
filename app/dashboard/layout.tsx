"use client";

import Link from "next/link";
import { useState } from "react";
import {
  UploadCloud,
  History,
  LayoutDashboard,
  ArrowUpRight,
  Clock,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0F] text-white">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-zinc-800 bg-zinc-950">
        <SidebarContent handleLogout={handleLogout} />
      </aside>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="text-2xl font-bold">
                Restore<span className="text-cyan-400">AI</span>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <SidebarContent handleLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur">
          <button
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ handleLogout }: { handleLogout: () => void }) {
  return (
    <>
      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <SidebarLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <SidebarLink href="/dashboard/upload" icon={<UploadCloud size={18} />} label="Upload Image" />
        <SidebarLink href="/dashboard/history" icon={<History size={18} />} label="Your restoration" />
        <SidebarLink href="/dashboard/upscale" icon={<ArrowUpRight size={18} />} label="Upscaler" />
        <SidebarLink href="/dashboard/upscalehistory" icon={<Clock size={18} />} label="Your Upscaler" />
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-zinc-800 mt-auto">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
    >
      {icon}
      {label}
    </Link>
  );
}
