// MotorGlow — WhyMotorGlow.tsx — mobile-first redesign
"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { MapPin, Leaf, ShieldCheck, Camera } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "We come to you",
    description: "No relocation needed. We find your parked car wherever it is.",
    bgType: "amber",
  },
  {
    icon: Leaf,
    title: "Eco-safe products",
    description:
      "Waterless or low-water premium solutions that are tough on dirt, gentle on the planet.",
    bgType: "green",
  },
  {
    icon: ShieldCheck,
    title: "Trained professionals",
    description:
      "Background-checked, uniformed team members who treat your car with care.",
    bgType: "indigo",
  },
  {
    icon: Camera,
    title: "Photo proof",
    description:
      "Before & after photos sent to you on completion — so you always know it's done right.",
    bgType: "rose",
  },
];

const getColorClasses = (bgType: string) => {
  switch (bgType) {
    case "amber":
      return { bg: "#FFF9E6", text: "#D97706" }; // Amber
    case "green":
      return { bg: "#E8F5E9", text: "#16A34A" }; // Green
    case "indigo":
      return { bg: "#E8EAF6", text: "#4F46E5" }; // Indigo
    case "rose":
      return { bg: "#FCE4EC", text: "#E11D48" }; // Rose
    default:
      return { bg: "#F5F5F5", text: "#0D0D0D" };
  }
};

export function WhyMotorGlow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative bg-white py-[80px] px-[20px] sm:py-[120px] sm:px-[32px] overflow-hidden" ref={ref}>
      
      {/* Absolute Faded Background Typography Logo Elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-[20vw] font-black text-black/[0.02] tracking-tighter mix-blend-multiply whitespace-nowrap hidden md:block"
        >
          GLOW
        </motion.span>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? (prefersReducedMotion ? false : { opacity: 1, y: 0 }) : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-[40px] sm:mb-[60px]"
        >
          <h2 className="text-[28px] sm:text-4xl font-extrabold tracking-tight text-[#0D0D0D]">
            Why MotorGlow?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] xl:gap-8 max-w-4xl mx-auto">
          {features.map((feature, i) => {
            const colors = getColorClasses(feature.bgType);
            return (
              <motion.div
                key={feature.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                animate={inView ? (prefersReducedMotion ? false : { opacity: 1, y: 0 }) : {}}
                whileHover={prefersReducedMotion ? false : { y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.08)" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-[16px] p-[20px] sm:p-[24px] flex flex-row gap-[16px] items-start border border-[#E5E5E5] transition-colors w-full"
              >
                <div 
                  className="shrink-0 w-[48px] h-[48px] rounded-[14px] flex items-center justify-center"
                  style={{ backgroundColor: colors.bg }}
                >
                  <feature.icon size={24} color={colors.text} strokeWidth={2} />
                </div>
                <div className="flex-1 mt-0.5">
                  <h3 className="font-bold text-[#0D0D0D] text-[16px] mb-[4px] leading-tight tracking-tight">{feature.title}</h3>
                  <p className="text-[14px] text-[#6B6B6B] leading-[1.6]">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
