"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type RiskLevel = "low" | "moderate" | "high";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  normal?: string;
  risk: RiskLevel;
  icon: React.ElementType;
  delay?: number;
}

const riskConfig = {
  low: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/15 text-emerald-300",
    glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    dot: "bg-emerald-400",
  },
  moderate: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    badge: "bg-amber-500/15 text-amber-300",
    glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    dot: "bg-amber-400",
  },
  high: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    badge: "bg-red-500/15 text-red-300",
    glow: "hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]",
    dot: "bg-red-400",
  },
};

export function MetricCard({
  label,
  value,
  unit,
  normal,
  risk,
  icon: Icon,
  delay = 0,
}: MetricCardProps) {
  const cfg = riskConfig[risk];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, scale: 1.02 }}
      className={clsx(
        "glass rounded-xl p-5 border transition-all duration-300 group",
        cfg.border,
        cfg.glow
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center", cfg.bg)}>
          <Icon size={18} className={cfg.color} />
        </div>
        <span className={clsx("text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1", cfg.badge)}>
          <span className={clsx("w-1.5 h-1.5 rounded-full", cfg.dot)} />
          {risk.charAt(0).toUpperCase() + risk.slice(1)}
        </span>
      </div>

      {/* Value */}
      <div className="mb-2">
        <motion.span
          className={clsx("text-3xl font-bold font-mono", cfg.color)}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delay + 0.2 }}
        >
          {value}
        </motion.span>
        {unit && (
          <span className="text-slate-500 text-sm ml-1">{unit}</span>
        )}
      </div>

      <p className="text-slate-300 text-sm font-medium">{label}</p>
      {normal && (
        <p className="text-slate-600 text-xs mt-1">Normal: {normal}</p>
      )}
    </motion.div>
  );
}
