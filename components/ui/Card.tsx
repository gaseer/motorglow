"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dark" | "popular";
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
    dark: "bg-[#0D0D0D] border border-[#0D0D0D] text-white",
    popular: "bg-white border-2 border-[#C8F135] text-[#0D0D0D] scale-[1.02]",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-6",
        variantClasses[variant],
        hover && "transition-transform duration-200 hover:scale-[1.02]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
