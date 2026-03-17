"use client";

import { motion } from "framer-motion";
import { Heart, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 px-6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(34,211,238,0.02))",
        }}
      />

      <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg glass-cyan flex items-center justify-center">
            <Heart size={16} className="text-cyan-400" />
          </div>
          <span className="font-semibold text-white text-sm">
            PrenatalAI
          </span>
          <span className="text-slate-600 text-xs ml-2">
            © 2026 · For educational purposes
          </span>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-6 text-sm text-slate-500"
        >
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">
            Privacy
          </span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">
            Terms
          </span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">
            Contact
          </span>
        </motion.div>

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4"
        >
          {[
            { icon: Github, label: "GitHub" },
            { icon: Twitter, label: "Twitter" },
            { icon: Mail, label: "Email" },
          ].map(({ icon: Icon, label }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.2, color: "#22d3ee" }}
              whileTap={{ scale: 0.9 }}
              className="text-slate-500 hover:text-cyan-400 transition-colors"
              aria-label={label}
            >
              <Icon size={18} />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </footer>
  );
}
