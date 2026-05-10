"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Leaf, Shield, Camera } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "We come to you",
    description: "No relocation needed. We find your parked car wherever it is.",
  },
  {
    icon: Leaf,
    title: "Eco-safe products",
    description:
      "Waterless or low-water premium solutions that are tough on dirt, gentle on the planet.",
  },
  {
    icon: Shield,
    title: "Trained professionals",
    description:
      "Background-checked, uniformed team members who treat your car with care.",
  },
  {
    icon: Camera,
    title: "Photo proof",
    description:
      "Before & after photos sent to you on completion — so you always know it's done right.",
  },
];

export function WhyMotorGlow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-[#F5F5F5] py-24 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D0D0D]">
            Why MotorGlow?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 flex gap-4 items-start border border-[#E5E5E5]"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-[#C8F135]/10 flex items-center justify-center">
                <feature.icon size={20} className="text-[#0D0D0D]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-[#0D0D0D] mb-1">{feature.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
