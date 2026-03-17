"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface RiskGaugeProps {
  score: number; // 0–100
  label?: string;
}

function getColor(score: number) {
  if (score < 35) return { stroke: "#10b981", label: "Low Risk", text: "text-emerald-400" };
  if (score < 65) return { stroke: "#f59e0b", label: "Moderate Risk", text: "text-amber-400" };
  return { stroke: "#ef4444", label: "High Risk", text: "text-red-400" };
}

export function RiskGauge({ score, label }: RiskGaugeProps) {
  const { stroke, label: riskLabel, text } = getColor(score);

  const r = 80;
  const cx = 110;
  const cy = 110;
  const circumference = Math.PI * r; // half circle
  const progress = useMotionValue(0);
  const strokeDashoffset = useTransform(
    progress,
    (v) => circumference - (v / 100) * circumference
  );

  useEffect(() => {
    const controls = animate(progress, score, {
      duration: 1.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3,
    });
    return controls.stop;
  }, [score, progress]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-56 h-32 overflow-hidden">
        <svg
          viewBox="0 0 220 120"
          className="absolute inset-0 w-full h-full"
        >
          {/* Background arc */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Colored progress arc */}
          <motion.path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke={stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            filter={`drop-shadow(0 0 8px ${stroke})`}
          />
        </svg>

        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <motion.span
            className={`text-4xl font-extrabold font-mono ${text}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {score}
          </motion.span>
          <span className="text-slate-500 text-xs">/ 100</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-2"
      >
        <p className={`text-lg font-bold ${text}`}>{riskLabel}</p>
        {label && <p className="text-slate-500 text-xs mt-1">{label}</p>}
      </motion.div>
    </div>
  );
}
