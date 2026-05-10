// MotorGlow — Navbar.tsx — mobile-first redesign
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToPackages = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const pkgSection = document.getElementById("packages");
    if (pkgSection) {
      pkgSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ backgroundColor: "rgba(255, 255, 255, 0)", borderBottomColor: "rgba(229, 229, 229, 0)", backdropFilter: "blur(0px)" }}
      animate={
        prefersReducedMotion ? {} : { 
          backgroundColor: scrolled ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0)",
          borderBottomColor: scrolled ? "rgba(229, 229, 229, 1)" : "rgba(229, 229, 229, 0)",
        }
      }
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-40 border-b-[0.5px] ${scrolled ? "backdrop-blur-xl shadow-sm" : ""}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[56px] sm:h-[64px] flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 min-h-[44px] min-w-[44px] group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-[18px] h-[18px] rounded-full bg-[#C8F135]" 
          />
          <span
            className={`font-bold text-[18px] tracking-tight transition-colors ${
              scrolled ? "text-[#0D0D0D]" : "text-white group-hover:text-[#F5F5F5]"
            }`}
          >
            MotorGlow
          </span>
        </Link>

        {/* Right side nav */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link 
            href="/login" 
            className={`text-[13px] font-medium transition-colors ${
              scrolled ? "text-[#6B6B6B] hover:text-[#0D0D0D]" : "text-white/80 hover:text-white"
            } min-h-[44px] flex items-center justify-center px-1`}
          >
            Login
          </Link>

          <a href="#packages" onClick={handleScrollToPackages}>
            <Button variant="accent" size="sm" pulse>
              Book Now
            </Button>
          </a>
        </div>
      </nav>

      {/* Glass Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8F135] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
    </motion.header>
  );
}
