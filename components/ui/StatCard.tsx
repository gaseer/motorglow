"use client";

import { LucideIcon } from "lucide-react";
import { useInView, motion } from "framer-motion";
import { useRef } from "react";
import { useCountUp, fadeUp } from "@/lib/animations";

export interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  color?: "default" | "amber" | "lime" | "green";
  isLoading?: boolean;
  trend?: { value: number; label: string; positive: boolean };
}

const colorMap = {
  default: { bg: "bg-[#F5F5F5]", icon: "text-[#6B6B6B]", value: "text-[#0D0D0D]" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", value: "text-amber-700" },
  lime: { bg: "bg-[#0D0D0D]", icon: "text-[#C8F135]", value: "text-white" },
  green: { bg: "bg-green-50", icon: "text-green-600", value: "text-green-700" },
};

export function StatCard({ title, value, prefix = "", suffix = "", icon: Icon, color = "default", isLoading, trend }: StatCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  
  // Use the countUp hook. When inView is true and not loading, we start animating.
  const animatedValue = useCountUp(inView && !isLoading ? value : 0, 1.5);
  const colors = colorMap[color];

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-[16px] p-6 flex items-start gap-4 animate-pulse">
        <div className="bg-[#F5F5F5] rounded-[12px] w-[44px] h-[44px]" />
        <div className="flex-1 space-y-3 pt-1">
          <div className="h-4 bg-[#F5F5F5] rounded w-1/2" />
          <div className="h-8 bg-[#F5F5F5] rounded w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`border rounded-[16px] p-6 flex flex-col gap-4 relative overflow-hidden ${color === 'lime' ? 'bg-[#0D0D0D] border-[#222]' : 'bg-white border-[#E5E5E5]'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`${colors.bg} rounded-[12px] w-[44px] h-[44px] flex items-center justify-center shrink-0`}>
          <Icon size={20} className={colors.icon} />
        </div>
        <div>
          <p className={`text-[14px] font-medium ${color === 'lime' ? 'text-[#888]' : 'text-[#6B6B6B]'}`}>
            {title}
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-[28px] font-bold tracking-tight ${colors.value}`}>
              {prefix}{animatedValue}{suffix}
            </span>
          </div>
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${trend.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend.positive ? '+' : '-'}{trend.value}%
          </span>
          <span className={`text-[12px] ${color === 'lime' ? 'text-[#666]' : 'text-[#888]'}`}>
            {trend.label}
          </span>
        </div>
      )}
    </motion.div>
  );
}
