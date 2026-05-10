// MotorGlow — HowItWorks.tsx — mobile-first redesign
"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { MonitorSmartphone, Car, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MonitorSmartphone,
    title: "Book online",
    description: "Pick your package, drop your car's location and preferred time. Takes under 2 minutes.",
  },
  {
    number: "02",
    icon: Car,
    title: "We come to you",
    description: "Our trained team heads straight to your parking spot — no need to move your car.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Drive away clean",
    description: "Your car is fully cleaned inside and out. We send photo proof on completion.",
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="bg-white py-[64px] pb-[64px] px-[20px] sm:py-[96px] sm:px-[32px] overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={inView ? (prefersReducedMotion ? false : { opacity: 1, y: 0 }) : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-[26px] font-bold text-[#0D0D0D]">
            How it works
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 max-w-sm md:max-w-none mx-auto py-2">
          {/* Dashed vertical line for mobile */}
          <div className="absolute left-[28px] top-4 bottom-4 w-[1px] border-l border-dashed border-[#C8F135] md:hidden pointer-events-none" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -24 }}
              animate={inView ? (prefersReducedMotion ? false : { opacity: 1, x: 0 }) : {}}
              whileHover={prefersReducedMotion ? false : { y: -6, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.08)" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex gap-4 p-[20px] rounded-[16px] bg-white border border-[#E5E5E5] border-l-[4px] border-l-[#C8F135] md:border-l-[1px] md:border-t-4 transition-colors z-10 hover:border-l-[#C8F135] md:hover:border-[#C8F135]"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              <div className="w-[44px] shrink-0 flex justify-start items-start">
                <span className="text-[32px] font-bold text-[#C8F135] leading-none">{step.number}</span>
              </div>
              <div className="flex-1 flex flex-col items-start bg-white z-10 pt-1">
                <div className="w-[44px] h-[44px] rounded-[12px] bg-[#F5F5F5] flex items-center justify-center mb-3">
                  <step.icon size={22} className="text-[#0D0D0D]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[18px] md:text-lg font-semibold text-[#0D0D0D] mb-1">{step.title}</h3>
                <p className="text-[#6B6B6B] text-[14px] md:text-sm leading-[1.6]">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
