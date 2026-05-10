"use client";

import { useEffect, useRef, ReactNode, useState } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Handle lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Handle ESC mapping
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              // Close if dragged down sufficiently
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "relative bg-white w-full rounded-t-[24px] sm:rounded-[24px] shadow-2xl flex flex-col overflow-hidden max-w-lg max-h-[90vh]",
              className
            )}
          >
            {/* Drag Handle (Mobile only visually) */}
            <div className="w-full h-6 flex sm:hidden items-center justify-center cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-12 h-1.5 rounded-full bg-[#E5E5E5] mt-2" />
            </div>

            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] shrink-0 sm:mt-0 mt-2">
                <h2 className="text-[18px] font-bold text-[#0D0D0D] tracking-tight">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-full hover:bg-[#F5F5F5] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#C8F135]"
                >
                  <X size={20} className="text-[#6B6B6B]" />
                </button>
              </div>
            )}
            
            <div className="p-6 overflow-y-auto overscroll-contain flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
