"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: "default" | "amber" | "lime" | "green";
}

const colorMap = {
  default: { bg: "bg-[#F5F5F5]", icon: "text-[#6B6B6B]", value: "text-[#0D0D0D]" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", value: "text-amber-700" },
  lime: { bg: "bg-[#C8F135]/10", icon: "text-[#8aaa00]", value: "text-[#5a6b00]" },
  green: { bg: "bg-green-50", icon: "text-green-600", value: "text-green-700" },
};

export function StatCard({ title, value, icon: Icon, color = "default" }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 flex items-start gap-4">
      <div className={`${colors.bg} rounded-xl p-3`}>
        <Icon size={20} className={colors.icon} />
      </div>
      <div>
        <p className="text-sm text-[#6B6B6B]">{title}</p>
        <p className={`text-2xl font-bold mt-0.5 ${colors.value}`}>{value}</p>
      </div>
    </div>
  );
}
