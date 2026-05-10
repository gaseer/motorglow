"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
    <aside
      className={cn(
        "relative flex flex-col bg-white border-r border-[#E5E5E5] transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-[#E5E5E5] overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-full bg-[#C8F135] shrink-0" />
          {!collapsed && (
            <span className="font-bold text-[#0D0D0D] whitespace-nowrap">MotorGlow</span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-[#0D0D0D] text-white"
                  : "text-[#6B6B6B] hover:bg-[#F5F5F5] hover:text-[#0D0D0D]"
              )}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-[#E5E5E5]">
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#6B6B6B] hover:bg-red-50 hover:text-red-600 w-full transition-all cursor-pointer"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-white border border-[#E5E5E5] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#F5F5F5] z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
