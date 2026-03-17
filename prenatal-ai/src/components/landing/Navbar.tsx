"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { GlowButton } from "@/components/ui/GlowButton";
import { Heart, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-white/5 shadow-xl" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="w-8 h-8 rounded-lg glass-cyan flex items-center justify-center"
          >
            <Heart size={16} className="text-cyan-400" />
          </motion.div>
          <span className="font-bold text-white tracking-tight">
            Prenatal<span className="text-cyan-400">AI</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              whileHover={{ y: -1 }}
              className="text-slate-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-200"
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <GlowButton href="/upload" variant="cyan" size="sm">
            Get Started
          </GlowButton>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden glass border-t border-white/5 px-6 py-4 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-300 hover:text-cyan-300 text-sm py-1 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <GlowButton href="/upload" variant="cyan" size="sm" className="w-full mt-2">
            Get Started
          </GlowButton>
        </motion.div>
      )}
    </motion.nav>
  );
}
