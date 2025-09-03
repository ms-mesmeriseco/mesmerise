"use client";

import { motion } from "framer-motion";

const SIZE_MAP = {
  small: {
    radius: "rounded-md",
    font: "text-sm leading-none",
    px: 16, // px-2
    py: 4, // py-1
    hoverDeltaX: 6,
  },
  large: {
    radius: "rounded-lg",
    font: "text-xl",
    px: 12, // px-3
    py: 4, // py-2
    hoverDeltaX: 8,
  },
  "x-large": {
    radius: "rounded-xl",
    font: "text-5xl",
    px: 24, // px-6
    py: 8, // py-2
    hoverDeltaX: 10,
  },
};

const VARIANTS = {
  primary:
    "bg-[var(--foreground)] border-[var(--foreground)] text-[var(--background)] " +
    "hover:bg-transparent hover:border-[var(--mesm-blue)] hover:text-[var(--mesm-blue)]",
  secondary:
    "bg-transparent border-[var(--mesm-grey-dk)] text-[var(--mesm-l-grey)] " +
    "hover:bg-[var(--foreground)] hover:text-[var(--background)]",
};

export default function Button({
  href = "#",
  children,
  className = "",
  size = "small", // "small" | "large" | "x-large"
  variant = "primary", // "primary" | "secondary"
  ...props
}) {
  const cfg = SIZE_MAP[size] ?? SIZE_MAP.small;
  const variantClasses = VARIANTS[variant] ?? VARIANTS.primary;

  // inline base padding for Framer hover animation
  const baseStyle = {
    paddingLeft: cfg.px,
    paddingRight: cfg.px,
    paddingTop: cfg.py,
    paddingBottom: cfg.py,
  };

  return (
    <motion.a
      href={href}
      style={baseStyle}
      whileHover={{
        paddingLeft: cfg.px + cfg.hoverDeltaX,
        paddingRight: cfg.px + cfg.hoverDeltaX,
      }}
      transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }}
      className={`inline-block border w-fit select-none ${cfg.radius} ${cfg.font} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.a>
  );
}
