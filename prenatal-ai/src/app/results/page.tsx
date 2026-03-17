"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { RiskGauge } from "@/components/results/RiskGauge";
import { MetricCard } from "@/components/results/MetricCard";
import { RiskRadar, RiskBarChart } from "@/components/results/RiskChart";
import { GlowButton } from "@/components/ui/GlowButton";
import {
  Activity,
  Droplets,
  Weight,
  Thermometer,
  TestTube,
  Heart,
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

const metrics = [
  {
    label: "Blood Pressure",
    value: "142/91",
    unit: "mmHg",
    normal: "< 120/80",
    risk: "high" as const,
    icon: Activity,
    delay: 0,
  },
  {
    label: "Blood Glucose",
    value: 126,
    unit: "mg/dL",
    normal: "70–99",
    risk: "moderate" as const,
    icon: Droplets,
    delay: 0.06,
  },
  {
    label: "BMI",
    value: 27.4,
    unit: "kg/m²",
    normal: "18.5–24.9",
    risk: "moderate" as const,
    icon: Weight,
    delay: 0.12,
  },
  {
    label: "Hemoglobin",
    value: 11.2,
    unit: "g/dL",
    normal: "> 11.0",
    risk: "low" as const,
    icon: Thermometer,
    delay: 0.18,
  },
  {
    label: "Urine Protein",
    value: "2+",
    unit: "",
    normal: "Negative",
    risk: "high" as const,
    icon: TestTube,
    delay: 0.24,
  },
  {
    label: "Fetal Heart Rate",
    value: 152,
    unit: "bpm",
    normal: "110–160",
    risk: "low" as const,
    icon: Heart,
    delay: 0.3,
  },
];

const recommendations = [
  {
    type: "high" as const,
    icon: AlertTriangle,
    text: "Elevated blood pressure (142/91 mmHg) and proteinuria (2+) indicate possible pre-eclampsia. Immediate clinical evaluation recommended.",
  },
  {
    type: "moderate" as const,
    icon: Info,
    text: "Fasting glucose of 126 mg/dL is borderline. A 75g OGTT is advised to rule out gestational diabetes.",
  },
  {
    type: "low" as const,
    icon: CheckCircle,
    text: "Hemoglobin and fetal heart rate are within acceptable range. Continue standard monitoring schedule.",
  },
];

const typeConfig = {
  high: "border-red-500/30 bg-red-500/5 text-red-300",
  moderate: "border-amber-500/30 bg-amber-500/5 text-amber-300",
  low: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
};

export default function ResultsPage() {
  return (
    <main className="relative min-h-screen bg-[#050810] overflow-hidden">
      <Navbar />

      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(168,85,247,0.06) 0%, transparent 60%)",
        }}
      />
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10"
          >
            <div>
              <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-2">
                Analysis Complete
              </p>
              <h1 className="text-3xl font-bold text-white mb-2">
                Prenatal Risk <span className="gradient-text">Report</span>
              </h1>
              <p className="text-slate-500 text-sm">
                Generated on {new Date().toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <GlowButton variant="outline" size="sm">
                <Download size={16} />
                Export PDF
              </GlowButton>
              <GlowButton href="/upload" variant="cyan" size="sm">
                <RotateCcw size={16} />
                New Analysis
              </GlowButton>
            </div>
          </motion.div>

          {/* Overall Risk + Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Overall Score Card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass rounded-xl p-8 border border-red-500/20 flex flex-col items-center justify-center"
            >
              <p className="text-slate-400 text-sm mb-6 uppercase tracking-widest text-center">
                Overall Risk Score
              </p>
              <RiskGauge score={67} label="Based on 7 clinical markers" />
              <div className="mt-6 w-full space-y-2">
                {[
                  { label: "Pre-eclampsia Risk", pct: 72 },
                  { label: "GDM Risk", pct: 48 },
                  { label: "Preterm Risk", pct: 31 },
                ].map(({ label, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">{label}</span>
                      <span className="text-slate-400 font-mono">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background:
                            pct > 60
                              ? "linear-gradient(90deg, #ef4444, #f97316)"
                              : pct > 40
                                ? "linear-gradient(90deg, #f59e0b, #eab308)"
                                : "linear-gradient(90deg, #10b981, #22d3ee)",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Charts */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <RiskRadar />
              <RiskBarChart />
            </div>
          </div>

          {/* Metric Cards */}
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-white font-semibold text-lg mb-4"
          >
            Clinical Markers
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {metrics.map((m) => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-white font-semibold text-lg mb-4">
              AI Recommendations
            </h2>
            <div className="space-y-3">
              {recommendations.map(({ type, icon: Icon, text }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className={`rounded-xl border p-4 flex gap-3 ${typeConfig[type]}`}
                >
                  <Icon size={18} className="shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-slate-600 text-xs text-center mt-8"
          >
            This AI analysis is for informational purposes only and does not constitute medical advice.
            Always consult a qualified healthcare professional for diagnosis and treatment.
          </motion.p>
        </div>
      </div>
    </main>
  );
}
