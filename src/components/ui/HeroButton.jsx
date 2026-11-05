"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCursor, CURSOR_SIZE } from "./CustomCursor";

const DOT_R = CURSOR_SIZE / 2;
const HOVER_R = 60;

export default function HeroButton({
  href = "#",
  children,
  extraClass = "",
  size = "default",
  ...props
}) {
  const containerRef = useRef(null);
  const activeRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  // Shared global cursor position (viewport coords), so the circle inside the
  // button is the same circle as the site cursor — it just grows and gets
  // clipped by the button.
  const cursor = useCursor();
  const fallback = useMotionValue(0);
  const cx = cursor.x ?? fallback;
  const cy = cursor.y ?? fallback;
  const { scrollY } = useScroll();

  const radius = useSpring(DOT_R, { damping: 22, stiffness: 220 });

  const background = useTransform(
    [cx, cy, radius, scrollY],
    ([x, y, r]) => {
      const el = containerRef.current;
      if (!el || !activeRef.current) return "none";
      const rect = el.getBoundingClientRect();
      return `radial-gradient(circle ${r}px at ${x - rect.left}px ${y - rect.top}px, var(--mesm-yellow) ${Math.max(r - 1, 0)}px, transparent ${r}px)`;
    },
  );

  const handleEnter = () => {
    setIsHovered(true);
    if (!cursor.enabled) return;
    activeRef.current = true;
    radius.jump(DOT_R);
    radius.set(HOVER_R);
  };

  const handleLeave = () => {
    setIsHovered(false);
    activeRef.current = false;
    radius.jump(DOT_R);
  };

  const baseStyles =
    "inline-flex items-center justify-center select-none whitespace-nowrap duration-150 ease-out rounded-2xl hover:rounded-xl";

  const sizeStyles = {
    default: "w-fit h-[48px] md:w-fit px-6 py-1",
    lg: "h-[64px] w-fit px-6 py-2 text-md md:text-xl rounded-3xl",
  };
  return (
    <a
      href={href}
      ref={containerRef}
      data-cursor="hero"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`
  ${baseStyles}
        relative overflow-hidden
        ${sizeStyles[size]}
        bg-[var(--mesm-yellow)]
        border border-[var(--mesm-yellow)]
        text-[var(--background)] tracking-wide
        hover:bg-[var(--mesm-grey-dk)]/40 hover:border-[var(--mesm-yellow)] transition-colors duration-250
        ${extraClass}
      `}
      {...props}
    >
      {/* Text layer stays on top */}
      <span className="relative z-10 pointer-events-none">{children}</span>

      {/* The global cursor, grown and clipped to the button */}
      {cursor.enabled && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            background,
          }}
        />
      )}
    </a>
  );
}
