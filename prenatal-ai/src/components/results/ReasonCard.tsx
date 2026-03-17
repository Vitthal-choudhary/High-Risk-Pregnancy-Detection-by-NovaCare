"use client";

import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import { useState, useEffect } from "react";
import type { RiskLevel } from "@/types/patient";

// Sorted longest-first so multi-word phrases match before single words
const DANGER_KEYWORDS = [
  "severe hypertension",
  "severe hyperglycemia",
  "severe anaemia",
  "severe obesity",
  "gestational diabetes risk",
  "pre-eclampsia detected",
  "severe proteinuria",
  "significant proteinuria",
  "breech presentation",
  "abnormal fetal position",
  "advanced maternal age",
  "teenage pregnancy",
  "high blood pressure",
  "low haemoglobin",
  "mild proteinuria",
  "mild anaemia",
  "hypertension",
  "proteinuria",
  "anaemia",
];

function highlightKeywords(text: string): React.ReactNode[] {
  const escaped = DANGER_KEYWORDS.map((k) =>
    k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.split(pattern).map((part, i) => {
    const isDanger = DANGER_KEYWORDS.some(
      (kw) => kw.toLowerCase() === part.toLowerCase()
    );
    return isDanger ? (
      <span
        key={i}
        className="text-red-400 font-bold drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]"
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, 20);
    return () => clearInterval(id);
  }, [text]);

  if (done) {
    return (
      <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
        {highlightKeywords(text)}
      </p>
    );
  }

  return (
    <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
      {displayed}
      <span className="animate-pulse opacity-70">|</span>
    </p>
  );
}

interface ReasonCardProps {
  reasons: string;
  prediction: RiskLevel;
}

export function ReasonCard({ reasons, prediction }: ReasonCardProps) {
  const isHigh = prediction === "High Risk";
  const isMod = prediction === "Moderate Risk";

  const borderColor = isHigh
    ? "border-red-500/40"
    : isMod
      ? "border-amber-500/40"
      : "border-emerald-500/40";

  const bgGradient = isHigh
    ? "from-red-500/8 to-red-900/5"
    : isMod
      ? "from-amber-500/8 to-amber-900/5"
      : "from-emerald-500/8 to-emerald-900/5";

  const accentColor = isHigh
    ? "text-red-400"
    : isMod
      ? "text-amber-400"
      : "text-emerald-400";

  const glowShadow = isHigh
    ? "shadow-[0_0_30px_rgba(239,68,68,0.08)]"
    : isMod
      ? "shadow-[0_0_30px_rgba(245,158,11,0.08)]"
      : "shadow-[0_0_30px_rgba(16,185,129,0.08)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`rounded-xl border ${borderColor} bg-gradient-to-br ${bgGradient} ${glowShadow} p-6 mb-8`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <BrainCircuit size={20} className={accentColor} />
        </motion.div>
        <span
          className={`text-xs font-bold tracking-widest uppercase ${accentColor}`}
        >
          Reason for Referral
        </span>
        <span
          className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full border ${borderColor} ${accentColor}`}
        >
          {prediction}
        </span>
      </div>

      {/* Typewriter reason text */}
      <TypewriterText text={reasons} />

      {/* Decorative bottom bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
        style={{ originX: 0 }}
        className={`mt-4 h-px bg-gradient-to-r ${
          isHigh
            ? "from-red-500/50 to-transparent"
            : isMod
              ? "from-amber-500/50 to-transparent"
              : "from-emerald-500/50 to-transparent"
        }`}
      />
    </motion.div>
  );
}
