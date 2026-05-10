"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { motion } from "framer-motion";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[100svh] w-full bg-[#0D0D0D] flex items-center justify-center flex-col relative z-50">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-6"
        >
          {/* Lime pulse dots loader */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-[80px] h-[80px] bg-[#C8F135]/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute w-[60px] h-[60px] bg-[#C8F135]/40 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            <div className="relative w-8 h-8 rounded-full bg-[#C8F135] shadow-[0_0_30px_rgba(200,241,53,0.6)]" />
          </div>
          
          <span className="text-white font-extrabold tracking-tight text-xl flex items-baseline gap-1">
            MotorGlow <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>.</motion.span>
          </span>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
