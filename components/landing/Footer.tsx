// MotorGlow — Footer.tsx — mobile-first redesign
"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <footer ref={ref} className="relative bg-[#0D0D0D] py-[60px] px-[20px] overflow-hidden">
      {/* Animated Top Border */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: "anticipate" }}
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8F135] to-transparent opacity-50 origin-center"
      />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Top Section */}
        <div className="flex flex-col items-center mb-[32px]">
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-[8px] mb-[6px] cursor-pointer"
            >
              <div className="w-[20px] h-[20px] rounded-full bg-[#C8F135]" />
              <span className="font-extrabold tracking-tight text-white text-[20px]">MotorGlow</span>
            </motion.div>
          </Link>
          <span className="text-[14px] text-[#6B6B6B]">We come to your car.</span>
        </div>

        {/* Middle Section */}
        <div className="flex items-center gap-[32px] mb-[40px]">
          <a href="#packages" className="text-[14px] font-medium text-[#888888] hover:text-[#C8F135] transition-colors p-2">
            Book a Wash
          </a>
          <Link href="/login" className="text-[14px] font-medium text-[#888888] hover:text-[#C8F135] transition-colors p-2">
            Login
          </Link>
        </div>

        {/* Bottom Section */}
        <div className="w-full pt-[32px] border-t border-[#1a1a1a] flex flex-col items-center gap-[16px] sm:flex-row sm:justify-between sm:px-4">
          <span className="text-[13px] text-[#444444]">
            © 2025 MotorGlow. All rights reserved.
          </span>
          <motion.a
            whileHover={{ scale: 1.1, rotate: 5, color: "#C8F135" }}
            whileTap={{ scale: 0.9 }}
            href="https://instagram.com/motorglow"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[#6B6B6B] transition-colors p-2 flex items-center justify-center min-w-[44px] min-h-[44px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </motion.a>
        </div>

      </div>
    </footer>
  );
}
