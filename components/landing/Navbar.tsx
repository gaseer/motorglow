"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white border-b border-[#E5E5E5]" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#C8F135]" />
          <span
            className={`font-bold text-xl tracking-tight transition-colors ${
              scrolled ? "text-[#0D0D0D]" : "text-white"
            }`}
          >
            MotorGlow
          </span>
        </Link>

        {/* Desktop nav */}
        <Link href="/login" className="hidden sm:block">
          <Button variant="primary" size="sm">
            Login / Register
          </Button>
        </Link>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={22} className={scrolled ? "text-[#0D0D0D]" : "text-white"} />
          ) : (
            <Menu size={22} className={scrolled ? "text-[#0D0D0D]" : "text-white"} />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden bg-white border-b border-[#E5E5E5] px-4 py-4"
          >
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                Login / Register
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
