import { Variants, Transition } from "framer-motion";
import { useEffect, useState } from "react";

// --- SPRING PRESETS ---
export const premiumSpring: Transition = {
  type: "spring",
  stiffness: 60,
  damping: 20,
  mass: 1,
  bounce: 0,
};

export const snappySpring: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 15,
  mass: 0.8,
};

// --- VARIANTS ---
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { ...premiumSpring } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { ...premiumSpring } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2, ease: "easeIn" } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { ...snappySpring } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { ...premiumSpring } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { ...premiumSpring } },
  exit: { opacity: 0, x: 30, transition: { duration: 0.2 } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 15, stiffness: 200 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
};

// --- CUSTOM HOOKS ---
export function useCountUp(end: number, duration: number = 2) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
}
