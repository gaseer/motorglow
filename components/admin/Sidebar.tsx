"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarCheck,
  Package,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/dashboard/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/dashboard/packages", label: "Packages", icon: Package },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    document.cookie = "mg_admin_session=; Max-Age=0; path=/";
    router.replace("/admin/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden sm:flex relative flex-col bg-white border-r border-[#E5E5E5] transition-all duration-300 shrink-0 h-[100svh] sticky top-0",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[#E5E5E5] overflow-hidden shrink-0">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-7 h-7 rounded-full bg-[#C8F135] shrink-0" />
            {!collapsed && (
              <span className="font-extrabold text-[#0D0D0D] tracking-tight whitespace-nowrap text-lg">MotorGlow</span>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-colors",
                  active
                    ? "text-[#0D0D0D]"
                    : "text-[#6B6B6B] hover:text-[#0D0D0D]"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="desktop-active-indicator"
                    className="absolute inset-0 bg-[#F5F5F5] rounded-[12px] -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <Icon size={20} className={cn("shrink-0", active ? "text-[#0D0D0D]" : "text-[#888888]")} />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-[#E5E5E5]">
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold text-[#6B6B6B] hover:bg-red-50 hover:text-red-600 w-full transition-all cursor-pointer group"
          >
            <LogOut size={20} className="shrink-0 group-hover:text-red-500" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-[14px] top-20 w-7 h-7 bg-white shadow-sm border border-[#E5E5E5] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#F5F5F5] transition-colors z-10 text-[#6B6B6B] hover:text-[#0D0D0D]"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>


      {/* Mobile Sticky Bottom Nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#E5E5E5] flex justify-around items-center px-2 py-2 pb-[env(safe-area-inset-bottom)] z-50">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="flex flex-col items-center justify-center w-16 h-14 relative rounded-[12px]">
              {active && (
                <motion.div
                  layoutId="mobile-active-indicator"
                  className="absolute inset-0 bg-[#F5F5F5] rounded-[12px] -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <Icon size={22} className={cn("mb-1 transition-colors", active ? "text-[#0D0D0D]" : "text-[#888888]")} />
              <span className={cn("text-[10px] font-bold transition-colors", active ? "text-[#0D0D0D]" : "text-[#888888]")}>{label}</span>
            </Link>
          );
        })}
        {/* Mobile Logout (condensed) */}
        <button onClick={handleLogout} className="flex flex-col items-center justify-center w-16 h-14 text-[#888888] hover:text-red-600 transition-colors">
          <LogOut size={22} className="mb-1" />
          <span className="text-[10px] font-bold">Logout</span>
        </button>
      </nav>
    </>
  );
}
