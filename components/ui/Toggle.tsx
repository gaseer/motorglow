"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label className={cn("flex items-center gap-3 cursor-pointer select-none", disabled && "opacity-50 cursor-not-allowed")}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8F135] focus-visible:ring-offset-2",
          checked ? "bg-[#C8F135]" : "bg-[#E5E5E5]"
        )}
      >
        <motion.span
          initial={false}
          animate={{ x: checked ? 22 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-shadow",
            checked ? "shadow-[0_2px_4px_rgba(0,0,0,0.1)]" : "shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
          )}
        />
      </button>
      {label && <span className="text-[14px] font-medium text-[#0D0D0D]">{label}</span>}
    </label>
  );
}
