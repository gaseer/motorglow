"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  textarea?: boolean;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, label, error, hint, icon, textarea, id, maxLength, onChange, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : "input-" + Math.random().toString(36).substr(2, 9));
    const [charCount, setCharCount] = useState((props.value || props.defaultValue || "").toString().length);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (maxLength) {
        setCharCount(e.target.value.length);
      }
      onChange?.(e as any);
    };

    const commonProps = {
      id: inputId,
      ref: ref as any,
      onChange: handleChange,
      maxLength,
      placeholder: label ? " " : props.placeholder,
      className: cn(
        "peer w-full bg-white border text-[#0D0D0D] transition-all duration-200 outline-none",
        "focus:border-[#0D0D0D] focus:ring-4 focus:ring-[#0D0D0D]/5",
        error ? "border-red-400 focus:border-red-500 focus:ring-red-500/10 placeholder:text-red-300" : "border-[#E5E5E5] placeholder:text-transparent",
        icon ? "pl-11" : "pl-4",
        label ? "pt-6 pb-2" : "py-4",
        "pr-4 rounded-[14px] text-[15px] min-h-[56px]",
        className
      ),
      ...props
    };

    return (
      <motion.div 
        className="flex flex-col gap-1.5 w-full relative"
        animate={error ? { x: [-3, 3, -3, 3, 0] } : {}}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-full">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] z-10 pointer-events-none transition-colors peer-focus:text-[#0D0D0D]">
              {icon}
            </div>
          )}

          {textarea ? (
            <textarea {...(commonProps as any)} className={cn(commonProps.className, "min-h-[140px] resize-y")} />
          ) : (
            <input {...(commonProps as any)} />
          )}

          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                "absolute transition-all duration-200 pointer-events-none z-10 font-medium",
                icon ? "left-11" : "left-4",
                "top-1/2 -translate-y-1/2 text-[15px] text-[#6B6B6B]",
                "peer-focus:top-[14px] peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[#0D0D0D]",
                "peer-[:not(:placeholder-shown)]:top-[14px] peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-[#888888]",
                error && "text-red-500 peer-focus:text-red-600 peer-[:not(:placeholder-shown)]:text-red-500"
              )}
            >
              {label}
            </label>
          )}
        </div>

        {(error || hint || maxLength) && (
          <div className="flex justify-between items-start px-1 gap-2">
            {error ? (
              <span className="text-[13px] text-red-500 font-medium leading-tight">{error}</span>
            ) : hint ? (
              <span className="text-[13px] text-[#888888] leading-tight">{hint}</span>
            ) : (
              <span />
            )}

            {maxLength && (
              <span className="text-[12px] text-[#A0A0A0] shrink-0 font-medium">
                {charCount} / {maxLength}
              </span>
            )}
          </div>
        )}
      </motion.div>
    );
  }
);
Input.displayName = "Input";
