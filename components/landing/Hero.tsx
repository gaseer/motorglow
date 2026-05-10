// MotorGlow — Hero.tsx — mobile-first redesign
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ParticleField } from "@/components/ui/ParticleField";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const handleScrollToHowItWorks = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const section = document.getElementById("how-it-works");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToPackages = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const section = document.getElementById("packages");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-[#0D0D0D] min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-[80px] px-4 sm:px-6 lg:px-8">
      {/* Immersive Particle Field Background */}
      <ParticleField intensity={60} color="#C8F135" />

      {/* Animated Car Element */}
      <div className="relative w-[280px] md:w-[420px] mb-8 mx-auto flex justify-center z-10 pointer-events-none">
        <motion.div
           initial={prefersReducedMotion ? false : { x: 300 }}
           animate={prefersReducedMotion ? false : { x: 0 }}
           transition={{ duration: 1.2, ease: "easeOut", type: "spring", stiffness: 60, damping: 20 }}
           className="relative"
        >
          <motion.div
            animate={prefersReducedMotion ? false : { y: [0, -6, 0] }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          >
            <svg
              viewBox="0 0 640 280"
              className="w-full h-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Car Body */}
              <path
                d="M120 200 L160 120 L200 100 L420 100 L500 120 L580 120 L620 160 L640 200 L640 240 L120 240 Z"
                stroke="#C8F135"
                strokeWidth="2"
                fill="none"
              />
              {/* Wheels */}
              <circle cx="220" cy="240" r="45" stroke="#C8F135" strokeWidth="2" fill="none" />
              <circle cx="520" cy="240" r="45" stroke="#C8F135" strokeWidth="2" fill="none" />
              <circle cx="220" cy="240" r="20" stroke="#C8F135" strokeWidth="1.5" fill="none" />
              <circle cx="520" cy="240" r="20" stroke="#C8F135" strokeWidth="1.5" fill="none" />
              {/* Windows */}
              <path d="M215 120 L245 105 L370 105 L370 120 Z" stroke="#C8F135" strokeWidth="1.5" fill="none" />
              <path d="M380 120 L380 105 L480 105 L495 120 Z" stroke="#C8F135" strokeWidth="1.5" fill="none" />
              {/* Door Line */}
              <path d="M375 120 L375 220" stroke="#C8F135" strokeWidth="1.5" fill="none" />
            </svg>
            
            {/* Water Droplets */}
            {!prefersReducedMotion && (
               <>
                 <motion.div
                   className="absolute top-0 right-10"
                   initial={{ y: -20, opacity: 1 }}
                   animate={{ y: 20, opacity: 0 }}
                   transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                 >
                   <svg width="12" height="18" viewBox="0 0 12 18" fill="none" stroke="#C8F135" strokeWidth="1.5">
                     <path d="M6 1 L11 10 Q6 17 1 10 Z" />
                   </svg>
                 </motion.div>
                 <motion.div
                   className="absolute -top-4 right-20"
                   initial={{ y: -20, opacity: 1 }}
                   animate={{ y: 20, opacity: 0 }}
                   transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                 >
                   <svg width="12" height="18" viewBox="0 0 12 18" fill="none" stroke="#C8F135" strokeWidth="1.5">
                     <path d="M6 1 L11 10 Q6 17 1 10 Z" />
                   </svg>
                 </motion.div>
                 <motion.div
                   className="absolute top-4 left-1/2"
                   initial={{ y: -20, opacity: 1 }}
                   animate={{ y: 20, opacity: 0 }}
                   transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                 >
                   <svg width="12" height="18" viewBox="0 0 12 18" fill="none" stroke="#C8F135" strokeWidth="1.5">
                     <path d="M6 1 L11 10 Q6 17 1 10 Z" />
                   </svg>
                 </motion.div>
               </>
            )}
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto text-center flex flex-col items-center pb-12">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h1
            className="font-bold text-white mb-4"
            style={{ fontSize: "clamp(38px, 8vw, 72px)", lineHeight: 1.1 }}
          >
            Your car cleaned,<br />
            <motion.span 
              animate={{ backgroundPosition: ["100% center", "-100% center"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 4 }}
              className="bg-gradient-to-r from-[#C8F135] via-white to-[#C8F135] bg-[length:200%_auto] text-transparent bg-clip-text"
            >
              right where it&apos;s parked.
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-[#888888] text-[15px] leading-[1.6] max-w-sm md:max-w-xl mx-auto mb-8 md:mb-10 line-clamp-2 md:line-clamp-none font-medium mix-blend-screen"
        >
          We come to your parking spot. <br className="md:hidden" /> Professional wash, zero hassle.
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col items-center w-full max-w-[300px]"
        >
          <a href="#packages" onClick={handleScrollToPackages} className="w-full mb-4">
            <Button variant="accent" size="xl" className="w-full text-[16px] font-bold" pulse>
              Book a Wash <span className="text-xl ml-1 leading-none font-normal">→</span>
            </Button>
          </a>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1.6 }}
            className="flex items-center justify-center gap-2 text-[13px] text-[#6B6B6B]"
          >
            <div className="flex gap-0.5 text-[#C8F135]">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.8 + i * 0.1, type: "spring", stiffness: 200 }}
                >
                  ★
                </motion.span>
              ))}
            </div>
            <span className="font-medium tracking-tight">Trusted by 500+ drivers</span>
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#how-it-works"
        onClick={handleScrollToHowItWorks}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={prefersReducedMotion ? false : { opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 p-4 flex justify-center items-center cursor-pointer min-h-[44px] min-w-[44px] z-10"
        aria-label="Scroll to how it works"
      >
        <motion.div
          animate={prefersReducedMotion ? false : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={22} className="text-[#6B6B6B]" />
        </motion.div>
      </motion.a>
    </section>
  );
}
