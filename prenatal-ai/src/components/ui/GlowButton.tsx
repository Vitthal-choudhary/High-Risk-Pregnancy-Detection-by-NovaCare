"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "cyan" | "purple" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const variants = {
  cyan: "bg-cyan-500 text-black font-semibold hover:bg-cyan-400 glow-cyan",
  purple: "bg-purple-600 text-white font-semibold hover:bg-purple-500 glow-purple",
  outline:
    "border border-cyan-500/60 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/10 hover:glow-cyan",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function GlowButton({
  children,
  onClick,
  href,
  variant = "cyan",
  size = "md",
  className,
  disabled,
  type = "button",
}: GlowButtonProps) {
  const baseClass = clsx(
    "relative inline-flex items-center justify-center gap-2 rounded-lg",
    "transition-all duration-300 cursor-pointer select-none",
    "focus:outline-none focus:ring-2 focus:ring-cyan-500/50",
    variants[variant],
    sizes[size],
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.05, y: -2 },
    whileTap: disabled ? {} : { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 400, damping: 17 },
  };

  if (href) {
    return (
      <motion.a href={href} className={baseClass} {...motionProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
