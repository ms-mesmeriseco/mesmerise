"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function HeroButton({
  href = "#",
  children,
  extraClass = "",
  ...props
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // 1. Motion values for raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 2. Spring physics for the "Inertia" effect
  // Adjust stiffness (speed) and damping (bounce) to taste
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 150 });

  // 3. Map the smooth values directly into your radial gradient string
  const background = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(
      circle 60px at ${x}px ${y}px, 
      var(--mesm-yellow) 0%, 
      var(--mesm-yellow) 90%, 
      transparent 91%
    )`,
  );

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const baseStyles =
    "inline-flex items-center justify-center select-none border whitespace-nowrap duration-150 ease-out rounded-2xl hover:rounded-xl";

  return (
    <a
      href={href}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        ${baseStyles}
        relative overflow-hidden
        w-full h-[48px] md:w-fit px-6 py-1
        bg-[var(--mesm-yellow)]  
        text-[var(--background)] tracking-wide 
        hover:bg-[var(--mesm-grey-dk)]/40 hover:border-[var(--mesm-grey)]  transition-colors duration-250
        ${extraClass}
      `}
      {...props}
    >
      {/* Text layer stays on top */}
      <span className="relative z-10 pointer-events-none">{children}</span>

      {/* The Animated Hard Blue Circle */}
      <motion.div
        className="absolute inset-0 pointer-events-none transition-opacity duration-50"
        style={{
          opacity: isHovered ? 1 : 0,
          background,
        }}
      />
    </a>
  );
}
