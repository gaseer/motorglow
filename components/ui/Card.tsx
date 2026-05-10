"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "dark" | "popular" | "ghost" | "glass";
  hover?: boolean;
}

export function Card({
  variant = "default",
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  const variantClasses = {
    default: "bg-white border border-[#E5E5E5] text-[#0D0D0D]",
    dark: "bg-[#0D0D0D] border border-[#222222] text-white",
    popular: "bg-white border-2 border-[#C8F135] text-[#0D0D0D] shadow-sm",
    ghost: "bg-transparent border border-dashed border-[#E5E5E5] text-[#0D0D0D]",
    glass: "bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm text-[#0D0D0D]",
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.08)" } : {}}
      className={cn(
        "rounded-[20px] p-6 lg:p-8 relative overflow-hidden transition-colors duration-300",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
