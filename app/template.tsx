"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
