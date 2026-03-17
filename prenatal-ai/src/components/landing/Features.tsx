"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Brain,
  FileSearch,
  ShieldCheck,
  BarChart3,
  Clock,
  Microscope,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Neural Risk Modeling",
    description:
      "Deep learning models trained on millions of prenatal cases to predict complications with clinical-grade precision.",
    color: "text-cyan-400",
    glow: "cyan" as const,
    delay: 0,
  },
  {
    icon: FileSearch,
    title: "Multi-Format Analysis",
    description:
      "Upload PDF reports, CSV lab data, or structured records. Our AI extracts and normalizes all relevant markers.",
    color: "text-purple-400",
    glow: "purple" as const,
    delay: 0.1,
  },
  {
    icon: ShieldCheck,
    title: "HIPAA-Grade Security",
    description:
      "End-to-end encryption with zero data retention. Your medical data is analyzed and immediately purged.",
    color: "text-blue-400",
    glow: "none" as const,
    delay: 0.2,
  },
  {
    icon: BarChart3,
    title: "Visual Risk Dashboard",
    description:
      "Interactive charts and visualizations break down each risk factor with percentile rankings and trends.",
    color: "text-cyan-400",
    glow: "cyan" as const,
    delay: 0.3,
  },
  {
    icon: Clock,
    title: "Real-Time Results",
    description:
      "Get comprehensive risk analysis in under 3 seconds — faster than any lab, with higher consistency.",
    color: "text-purple-400",
    glow: "purple" as const,
    delay: 0.4,
  },
  {
    icon: Microscope,
    title: "15+ Clinical Markers",
    description:
      "Analyzes blood pressure, glucose levels, BMI, age, parity, hemoglobin, protein levels, and more.",
    color: "text-blue-400",
    glow: "none" as const,
    delay: 0.5,
  },
];

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  glow,
  delay,
}: (typeof features)[0]) {
  return (
    <GlassCard glow={glow} delay={delay} className="group">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300
          bg-white/5 group-hover:scale-110 ${color}`}
        style={{
          boxShadow:
            glow === "cyan"
              ? "0 0 20px rgba(34,211,238,0.15)"
              : glow === "purple"
                ? "0 0 20px rgba(168,85,247,0.15)"
                : "0 0 20px rgba(59,130,246,0.15)",
        }}
      >
        <Icon size={24} />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-cyan-300 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </GlassCard>
  );
}

export function Features() {
  return (
    <section className="relative py-24 px-6">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-3">
          Capabilities
        </p>
        <h2 className="text-4xl font-bold text-white mb-4">
          Why Clinicians Trust{" "}
          <span className="gradient-text">Our Platform</span>
        </h2>
        <p className="text-slate-400 leading-relaxed">
          Built with the latest AI research and validated against clinical
          outcomes data from leading maternal health institutions.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}
