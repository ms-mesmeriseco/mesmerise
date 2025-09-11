"use client";

import { motion } from "framer-motion";

const SIZE_MAP = {
  small: {
    radius: "rounded-lg",
    font: "text-sm leading-none",
    px: 12, // px-2
    py: 6, // py-1
    hoverDeltaX: 4,
  },
  large: {
    radius: "md:rounded-xl rounded-2xl",
    font: "md:text-xl text-lg",
    px: 16, // px-3
    py: 4, // py-2
    hoverDeltaX: 0,
  },
  "x-large": {
    radius: "rounded-2xl",
    font: "md:text-2xl text-xl",
    px: 32, // px-6
    py: 7, // py-2
    hoverDeltaX: 8,
  },
};

const VARIANTS = {
  primary:
    "bg-[var(--foreground)] border-[var(--foreground)] text-[var(--background)] " +
    "hover:bg-transparent hover:border-[var(--mesm-blue)] hover:text-[var(--mesm-blue)]",
  secondary:
    "bg-transparent border-[var(--mesm-grey-dk)] text-[var(--mesm-l-grey)] " +
    "hover:bg-[var(--foreground)] hover:text-[var(--background)]",
  accent:
    "bg-[var(--accent)]/92 border-[var(--accent)]/100 text-[var(--background)]/98 " +
    "hover:bg-[var(--accent)]/15 hover:text-[var(--accent)] duration-200",
};

export default function Button({
  href = "#",
  children,
  extraClass = "",
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
      className={`inline-block border w-fit select-none ${cfg.radius} ${cfg.font} ${variantClasses} ${extraClass}`}
      {...props}
    >
      {children}
    </motion.a>
  );
}
