"use client";

import { motion } from "framer-motion";
import { DropZone } from "@/components/upload/DropZone";
import { Navbar } from "@/components/landing/Navbar";
import { ArrowLeft, Lock, FileText, Activity } from "lucide-react";

const hints = [
  { icon: FileText, text: "Lab reports (PDF/CSV)" },
  { icon: Activity, text: "Vital signs data" },
  { icon: Lock, text: "Encrypted & private" },
];

export default function UploadPage() {
  return (
    <main className="relative min-h-screen bg-[#050810] overflow-hidden">
      <Navbar />

      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(34,211,238,0.07) 0%, transparent 60%)",
        }}
      />
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="relative z-10 pt-28 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-400 text-sm mb-8 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </motion.a>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-3">
              Step 1 of 1
            </p>
            <h1 className="text-4xl font-bold text-white mb-3">
              Upload Your <span className="gradient-text">Medical Data</span>
            </h1>
            <p className="text-slate-400 leading-relaxed">
              Provide your prenatal records and our AI will analyze risk factors
              in seconds. All data is encrypted and never stored.
            </p>
          </motion.div>

          {/* Hints row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {hints.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="glass rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-slate-400"
              >
                <Icon size={13} className="text-cyan-400" />
                {text}
              </div>
            ))}
          </motion.div>

          {/* Drop zone */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <DropZone />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
