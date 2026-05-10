"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative bg-[#0D0D0D] min-h-screen flex items-center justify-center overflow-hidden">
      {/* Abstract SVG background */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-10">
        <svg
          viewBox="0 0 800 600"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[50vw] max-w-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Car silhouette — line art */}
          <path
            d="M120 360 L160 280 L200 260 L420 260 L500 280 L580 280 L620 320 L640 360 L640 400 L120 400 Z"
            stroke="#C8F135"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="220" cy="400" r="45" stroke="#C8F135" strokeWidth="2" fill="none" />
          <circle cx="520" cy="400" r="45" stroke="#C8F135" strokeWidth="2" fill="none" />
          <circle cx="220" cy="400" r="20" stroke="#C8F135" strokeWidth="1.5" fill="none" />
          <circle cx="520" cy="400" r="20" stroke="#C8F135" strokeWidth="1.5" fill="none" />
          {/* Windows */}
          <path d="M215 280 L245 265 L370 265 L370 280 Z" stroke="#C8F135" strokeWidth="1.5" fill="none" />
          <path d="M380 280 L380 265 L480 265 L495 280 Z" stroke="#C8F135" strokeWidth="1.5" fill="none" />
          {/* Water droplets */}
          <path d="M700 100 Q700 80 690 95 Q680 110 700 110 Q720 110 710 95 Q700 80 700 100Z" stroke="#C8F135" strokeWidth="1.5" fill="none" />
          <path d="M740 160 Q740 140 730 155 Q720 170 740 170 Q760 170 750 155 Q740 140 740 160Z" stroke="#C8F135" strokeWidth="1.5" fill="none" opacity="0.5" />
          <path d="M670 200 Q670 182 662 195 Q654 208 670 208 Q686 208 678 195 Q670 182 670 200Z" stroke="#C8F135" strokeWidth="1.5" fill="none" opacity="0.3" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="font-bold text-white leading-tight mb-6"
            style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
          >
            Your car cleaned,
            <br />
            <span className="text-[#C8F135]">right where it&apos;s parked.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#6B6B6B] text-lg max-w-xl mx-auto mb-10"
        >
          Professional interior &amp; exterior car wash delivered to any parking spot. Zero effort on your part.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <Link href="/login">
            <Button variant="accent" size="lg" className="group">
              Book a Wash
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>
          </Link>

          <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
            <span className="text-[#C8F135]">★★★★★</span>
            <span>Trusted by 500+ drivers</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
