// MotorGlow — Packages.tsx — mobile-first redesign
"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight, Droplets, Sparkles } from "lucide-react";
import { Package } from "@/lib/types";
import { Button } from "@/components/ui/Button";

// Fallback packages in case Supabase is not yet configured
const FALLBACK_PACKAGES: Package[] = [
  {
    id: "1",
    name: "Shell Shine",
    tagline: "A spotless exterior, every time.",
    price: 999,
    features: [
      "Full exterior hand wash",
      "Wheel & tyre clean",
      "Window wipe-down",
      "Exterior mirror clean",
    ],
    is_popular: false,
    sort_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    name: "Full Refresh",
    tagline: "Inside out, front to back.",
    price: 1999,
    features: [
      "Everything in Shell Shine",
      "Full interior vacuum",
      "Dashboard & console wipe",
      "Door panel clean",
      "Interior glass polish",
    ],
    is_popular: true,
    sort_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    name: "MotorGlow Premium",
    tagline: "The full detail. Nothing missed.",
    price: 3499,
    features: [
      "Everything in Full Refresh",
      "Foam pre-wash & clay bar",
      "Seat shampooing",
      "Engine bay wipe",
      "Air freshener finish",
      "Post-wash inspection report",
    ],
    is_popular: false,
    sort_order: 3,
    created_at: "",
    updated_at: "",
  },
];

function PackageCard({ pkg, index, inView }: { pkg: Package; index: number; inView: boolean }) {
  const isDark = index === 2;
  const isPopular = pkg.is_popular;
  const prefersReducedMotion = useReducedMotion();

  const Icon = isDark ? Sparkles : Droplets;

  const yOffset = isPopular ? -12 : 0; // Lift center card on desktop
  
  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
      animate={inView ? (prefersReducedMotion ? {} : { opacity: 1, y: yOffset }) : {}}
      whileHover={prefersReducedMotion ? {} : { y: yOffset - 8, scale: 1.01 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-[24px] p-8 flex flex-col h-full items-start ${
        isDark
          ? "bg-[#0D0D0D] text-white"
          : isPopular
          ? "bg-white border-2 border-[#C8F135] md:-mt-[12px]" // Additional margin shift on desktop for visual pop
          : "bg-white border border-[#E5E5E5]"
      }`}
      style={isPopular ? { boxShadow: "0 0 40px rgba(200,241,53,0.15)" } : {}}
    >
      {/* Badge */}
      {(isPopular || index === 2) && (
        <div className="absolute -top-3 right-6">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
              isPopular ? "bg-[#C8F135] text-[#0D0D0D]" : "bg-[#0D0D0D] text-[#C8F135]"
            }`}
          >
            {isPopular ? "Most Popular" : "Best Value"}
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="mb-4">
        <Icon size={28} className={isPopular || isDark ? "text-[#C8F135]" : "text-[#0D0D0D]"} />
      </div>

      <div className="mb-4">
        <h3
          className={`text-[20px] md:text-xl font-bold mb-1 tracking-tight ${isDark ? "text-white" : "text-[#0D0D0D]"}`}
        >
          {pkg.name}
        </h3>
        <p className={`text-[14px] md:text-[15px] ${isDark ? "text-[#999]" : "text-[#6B6B6B]"}`}>{pkg.tagline}</p>
      </div>

      <div className="mb-6 flex items-baseline gap-1">
        <span
          className={`text-[44px] font-extrabold leading-none tracking-tighter ${isDark ? "text-[#C8F135]" : "text-[#0D0D0D]"}`}
        >
          ₹{pkg.price.toLocaleString("en-IN")}
        </span>
        <span className="text-[13px] text-[#6B6B6B] font-medium">/ wash</span>
      </div>

      <ul className="flex flex-col gap-3.5 mb-10 flex-1 w-full">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-[14px]">
            <Check
              size={18}
              strokeWidth={2.5}
              className="shrink-0 mt-0.5 text-[#C8F135]"
            />
            <span className={isDark ? "text-[#ccc]" : "text-[#6B6B6B]"} style={{ lineHeight: 1.6 }}>{f}</span>
          </li>
        ))}
      </ul>

      <Link href="/login" className="mt-auto w-full">
        <Button 
          variant={isDark ? "accent" : isPopular ? "accent" : "outline"} 
          size="lg" 
          className="w-full font-bold"
          icon={<ArrowRight size={16} />}
        >
          Book Now
        </Button>
      </Link>
    </motion.div>
  );
}

export function Packages() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const prefersReducedMotion = useReducedMotion();
  const [packages, setPackages] = useState<Package[]>(FALLBACK_PACKAGES);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPackages(data);
      })
      .catch(() => {/* use fallback */});
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const scrollLeft = el.scrollLeft;
    const idx = Math.round(scrollLeft / (el.clientWidth * 0.8));
    setActiveIndex(Math.min(idx, packages.length - 1));
  };

  return (
    <section id="packages" className="bg-[#F5F5F5] py-[80px] pb-16 sm:py-[120px] overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={inView ? (prefersReducedMotion ? {} : { opacity: 1, y: 0 }) : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 px-[20px] sm:px-[32px]"
        >
          <h2 className="text-[32px] sm:text-4xl font-extrabold text-[#0D0D0D] mb-2 tracking-tight">
            Choose your clean
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#6B6B6B]">
            Pick the package that suits your car
          </p>
        </motion.div>

        {/* Mobile Horizontal Snap Scroll */}
        <div 
          className="flex md:hidden overflow-x-auto snap-x snap-mandatory px-[20px] pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={handleScroll}
        >
          {packages.map((pkg, i) => (
            <div key={pkg.id} className="min-w-[300px] snap-center shrink-0 mr-[16px] last:mr-0 min-h-[500px]">
              <PackageCard pkg={pkg} index={i} inView={inView} />
            </div>
          ))}
        </div>

        {/* Mobile Slide Indicators */}
        <div className="flex justify-center gap-2 mt-[12px] md:hidden">
          {packages.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-colors ${activeIndex === i ? "bg-[#C8F135]" : "bg-[#D1D1D1]"}`} 
            />
          ))}
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-[32px] items-stretch px-[32px] pt-8">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
