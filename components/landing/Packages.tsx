"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className={`relative rounded-2xl p-6 flex flex-col transition-transform duration-200 hover:scale-[1.02] ${
        isDark
          ? "bg-[#0D0D0D] text-white"
          : isPopular
          ? "bg-white border-2 border-[#C8F135]"
          : "bg-white border border-[#E5E5E5]"
      }`}
    >
      {/* Badge */}
      {(isPopular || index === 2) && (
        <div className="absolute -top-3 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isPopular ? "bg-[#C8F135] text-[#0D0D0D]" : "bg-[#0D0D0D] text-[#C8F135]"
            }`}
          >
            {isPopular ? "Most Popular" : "Best Value"}
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3
          className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-[#0D0D0D]"}`}
        >
          {pkg.name}
        </h3>
        <p className={`text-sm ${isDark ? "text-[#999]" : "text-[#6B6B6B]"}`}>{pkg.tagline}</p>
      </div>

      <div className="mb-6">
        <span
          className={`text-4xl font-bold ${isDark ? "text-[#C8F135]" : "text-[#0D0D0D]"}`}
        >
          ₹{pkg.price.toLocaleString("en-IN")}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5 mb-8 flex-1">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <Check
              size={16}
              className={`shrink-0 mt-0.5 ${isDark ? "text-[#C8F135]" : "text-[#0D0D0D]"}`}
            />
            <span className={isDark ? "text-[#ccc]" : "text-[#6B6B6B]"}>{f}</span>
          </li>
        ))}
      </ul>

      <Link href="/login">
        <Button
          variant={isDark ? "accent" : isPopular ? "primary" : "outline"}
          className="w-full group"
        >
          Book Now
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </motion.div>
  );
}

export function Packages() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [packages, setPackages] = useState<Package[]>(FALLBACK_PACKAGES);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPackages(data);
      })
      .catch(() => {/* use fallback */});
  }, []);

  return (
    <section id="packages" className="bg-[#F5F5F5] py-24 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D0D0D]">
            Choose your clean
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-4">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
