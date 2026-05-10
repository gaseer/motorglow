"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  children?: React.ReactNode;
  variant?: "primary" | "accent" | "outline" | "accent-outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  pulse?: boolean;
  icon?: React.ReactNode;
}

const variantClasses = {
  primary: "bg-[#0D0D0D] text-white hover:bg-[#1f1f1f] shadow-sm",
  accent: "bg-[#C8F135] text-[#0D0D0D] hover:bg-[#b5da30] shadow-sm",
  outline: "bg-transparent border border-[#E5E5E5] text-[#0D0D0D] hover:bg-[#F5F5F5]",
  "accent-outline": "bg-transparent border-2 border-[#C8F135] text-[#C8F135] hover:bg-[#C8F135]/10",
  ghost: "bg-transparent text-[#0D0D0D] hover:bg-[#F5F5F5]",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
};

const pulseClasses = {
  accent: "ring-4 ring-[#C8F135]/30 animate-pulse",
  primary: "",
  outline: "",
  "accent-outline": "",
  ghost: "",
  danger: "",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-[13px] rounded-[10px] min-h-[44px]",
  md: "px-5 py-2.5 text-[15px] rounded-[12px] min-h-[48px]",
  lg: "px-6 py-3.5 text-[16px] rounded-[14px] min-h-[52px]",
  xl: "px-8 py-4.5 text-[18px] rounded-[16px] min-h-[56px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      pulse = false,
      icon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        whileHover={disabled || loading ? {} : { y: -1 }}
        whileTap={disabled || loading ? {} : { scale: 0.97 }}
        className={cn(
          "relative font-medium transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-[#C8F135] focus-visible:ring-offset-2",
          variantClasses[variant],
          sizeClasses[size],
          pulse && pulseClasses[variant],
          className
        )}
        {...props}
      >
        <span className={cn("inline-flex items-center gap-2 relative transition-opacity duration-200", loading ? "opacity-0" : "opacity-100")}>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </span>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-[18px] h-[18px] border-[2.5px] border-current border-t-transparent rounded-full animate-spin" />
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
