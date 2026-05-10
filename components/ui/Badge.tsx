"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { motion } from "framer-motion";

type BadgeVariant = "default" | "accent" | "dark" | "amber" | "blue" | "green" | "red" | "lime";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[#F5F5F5] border border-[#E5E5E5] text-[#0D0D0D]",
  accent: "bg-[#C8F135]/20 border border-[#C8F135]/30 text-[#5a6b00]",
  dark: "bg-[#0D0D0D] border border-transparent text-[#C8F135]",
  amber: "bg-amber-100 border border-amber-200 text-amber-700",
  blue: "bg-blue-100 border border-blue-200 text-blue-700",
  green: "bg-green-100 border border-green-200 text-green-700",
  red: "bg-red-100 border border-red-200 text-red-700",
  lime: "bg-[#C8F135] border border-transparent text-[#0D0D0D]",
};

export function Badge({ variant = "default", dot = false, className, children, ...props }: BadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold tracking-wide",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-40"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current opacity-80"></span>
        </span>
      )}
      {children}
    </motion.span>
  );
}
