"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "cyan" | "purple" | "none";
  delay?: number;
  animate?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = "none",
  delay = 0,
  animate = true,
}: GlassCardProps) {
  const glowClass = {
    cyan: "hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]",
    purple: "hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    none: "hover:border-white/10",
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 24 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      className={clsx(
        "glass rounded-xl p-6 transition-all duration-300",
        hover && glowClass[glow],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
