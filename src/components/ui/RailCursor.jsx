"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

export default function RailCursor({ children, className, style, ...props }) {
  const ref = useRef(null);

  // 1. Raw values follow the mouse exactly
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [onControls, setOnControls] = useState(false);

  // 2. Spring values "chase" the raw values with inertia
  const springConfig = { damping: 25, stiffness: 500, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const [side, setSide] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      mouseX.set(cursorX);
      mouseY.set(cursorY);

      const isOnControls = !!e.target.closest("#hide-cursor");

      setOnControls(isOnControls);
      setVisible(!isOnControls);
      if (!isOnControls) {
        setSide(cursorX > rect.width / 2 ? "next" : "back");
      } else {
        setSide(null);
      }
    };

    const handleMouseLeave = () => setVisible(false);

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        cursor: onControls ? "auto" : "none",
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            key="rail-cursor"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 50,
              x, // This is now the spring value
              y, // This is now the spring value
              translateX: "-50%",
              translateY: "-50%",
              width: 85,
              height: 85,
              borderRadius: "50%",
              background: "var(--mesm-red)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={side}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.1 }}
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                  color: "var(--foreground)",
                  textTransform: "uppercase",
                  userSelect: "none",
                }}
              >
                {side === "next" ? "NEXT" : "BACK"}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
