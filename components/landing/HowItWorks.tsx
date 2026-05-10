"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MonitorSmartphone, Car, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MonitorSmartphone,
    title: "Book online",
    description:
      "Pick your package, drop your car's location and preferred time. Takes under 2 minutes.",
  },
  {
    number: "02",
    icon: Car,
    title: "We come to you",
    description:
      "Our trained team heads straight to your parking spot — no need to move your car.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Drive away clean",
    description:
      "Your car is fully cleaned inside and out. We send photo proof on completion.",
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D0D0D]">
            As simple as 1 – 2 – 3
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex flex-col gap-4 p-6 rounded-2xl border border-[#E5E5E5] bg-white hover:border-[#C8F135] transition-colors duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#C8F135]">{step.number}</span>
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] flex items-center justify-center">
                  <step.icon size={20} className="text-[#0D0D0D]" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#0D0D0D]">{step.title}</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
