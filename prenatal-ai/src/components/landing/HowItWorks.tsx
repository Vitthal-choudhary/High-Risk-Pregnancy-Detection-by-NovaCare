"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, BarChart2, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Medical Data",
    description:
      "Drag & drop your lab reports, ultrasound data, or patient records. Supports PDF, CSV, and structured formats.",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    bgColor: "rgba(34,211,238,0.06)",
  },
  {
    step: "02",
    icon: Cpu,
    title: "AI Processes Instantly",
    description:
      "Our neural engine extracts clinical markers, normalizes values, and runs multi-factor risk modeling in real time.",
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    bgColor: "rgba(168,85,247,0.06)",
  },
  {
    step: "03",
    icon: BarChart2,
    title: "Review Risk Dashboard",
    description:
      "Get a comprehensive visual report with risk scores, trend charts, and actionable clinical recommendations.",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bgColor: "rgba(59,130,246,0.06)",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(34,211,238,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-3">
            Process
          </p>
          <h2 className="text-4xl font-bold text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
            From data upload to risk assessment in three seamless steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector lines (desktop) */}
          <div className="hidden md:block absolute top-16 left-[33%] right-[33%] h-px">
            <div className="h-full bg-gradient-to-r from-cyan-500/20 via-purple-500/30 to-blue-500/20" />
          </div>

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.18,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Step number */}
              <div className="absolute -top-3 -right-3 text-xs font-mono text-slate-600 font-bold z-10">
                {s.step}
              </div>

              {/* Icon circle */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border ${s.borderColor}`}
                style={{ background: s.bgColor }}
              >
                <s.icon className={s.color} size={32} />
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: s.bgColor,
                    filter: "blur(8px)",
                  }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                />
              </motion.div>

              {/* Arrow between steps (mobile) */}
              {i < steps.length - 1 && (
                <ArrowRight
                  className="md:hidden text-slate-600 mb-4 rotate-90"
                  size={20}
                />
              )}

              <h3 className={`text-xl font-semibold mb-3 ${s.color} group-hover:opacity-100`}>
                {s.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
