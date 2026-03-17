"use client";

import { motion, type Variants } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

/* ─── Floating Particle ─────────────────────────────────── */
function Particle({ x, y, size, delay, color }: { x: number; y: number; size: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.8, 0.2],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* ─── Animated Grid Lines ───────────────────────────────── */
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid */}
      <div className="absolute inset-0 grid-pattern opacity-60" />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,211,238,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(168,85,247,0.1) 0%, transparent 50%)",
        }}
      />

      {/* Glowing orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          left: "10%",
          top: "20%",
          background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          right: "10%",
          top: "30%",
          background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
    </div>
  );
}

const particles = [
  { x: 15, y: 20, size: 3, delay: 0, color: "rgba(34,211,238,0.6)" },
  { x: 80, y: 15, size: 2, delay: 0.5, color: "rgba(168,85,247,0.6)" },
  { x: 60, y: 70, size: 4, delay: 1, color: "rgba(34,211,238,0.4)" },
  { x: 25, y: 80, size: 2, delay: 1.5, color: "rgba(59,130,246,0.6)" },
  { x: 90, y: 60, size: 3, delay: 0.7, color: "rgba(168,85,247,0.5)" },
  { x: 45, y: 10, size: 2, delay: 2, color: "rgba(34,211,238,0.5)" },
  { x: 70, y: 40, size: 3, delay: 0.3, color: "rgba(59,130,246,0.4)" },
  { x: 5, y: 50, size: 2, delay: 1.8, color: "rgba(168,85,247,0.4)" },
];

/* ─── Stat Badge ────────────────────────────────────────── */
function StatBadge({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.4, type: "spring" }}
      className="glass-cyan rounded-xl px-4 py-3 flex items-center gap-3"
    >
      <Icon className="text-cyan-400 shrink-0" size={18} />
      <div>
        <p className="text-cyan-300 font-bold text-sm leading-none">{value}</p>
        <p className="text-slate-400 text-xs mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

/* ─── Hero ──────────────────────────────────────────────── */
const textVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: "easeOut" },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GridBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 glass-cyan rounded-full px-4 py-2 mb-8"
        >
          <Sparkles size={14} className="text-cyan-400" />
          <span className="text-cyan-300 text-sm font-medium tracking-wide">
            Powered by Advanced AI · Medical Grade Analysis
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          custom={1}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6"
        >
          <span className="text-white">AI Prenatal</span>
          <br />
          <span className="gradient-text">Risk Analyzer</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          custom={2}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload your medical data and receive instant, AI-powered prenatal risk
          assessment. Early detection saves lives — precision medicine for every mother.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={3}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <GlowButton href="/upload" variant="cyan" size="lg">
            <Zap size={20} />
            Analyze My Data
            <ArrowRight size={20} />
          </GlowButton>
          <GlowButton href="/results" variant="outline" size="lg">
            View Sample Report
          </GlowButton>
        </motion.div>

        {/* Stats row */}
        <motion.div
          custom={4}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-4 justify-center"
        >
          <StatBadge icon={Shield} value="97.4%" label="Detection Accuracy" />
          <StatBadge icon={Zap} value="< 3s" label="Analysis Time" />
          <StatBadge icon={Sparkles} value="15+" label="Risk Factors Analyzed" />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #050810, transparent)",
        }}
      />
    </section>
  );
}
