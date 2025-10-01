// StaggeredWords.jsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function StaggeredWords({
  text,
  className = "",
  delay = 0.03,
  as: As = "h1",
  gradient = false,
  glass = false,
  margin = "-10% 0px",
  once = true,
  leading = 1.15, // <- give big text some breathing room
  yOffsetEm = 0.08, // <- smaller initial offset for huge headings
}) {
  const safeText = typeof text === "string" ? text : "";
  const words = safeText.split(" ");
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin });

  const wordClass = gradient
    ? "bg-linear-40 from-[var(--mesm-red)] to-[var(--dark-grey)] bg-clip-text text-transparent"
    : "";

  const wrapperClass = glass
    ? "px-4 py-1 rounded-4xl border border-white/20 bg-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] text-stroke"
    : "";

  return (
    <As
      className={className}
      style={{
        lineHeight: leading, // important for large type + translate
        overflow: "visible", // avoid clipping during animation
      }}
    >
      <span
        ref={ref}
        className={wrapperClass}
        style={{
          display: "block", // NOT flex; use normal inline wrapping
          whiteSpace: "normal",
        }}
      >
        {words.map((word, i) => (
          <span key={i} style={{ display: "inline" }}>
            <motion.span
              className={`inline-block align-baseline will-change-transform ${wordClass}`}
              initial={{ y: `${yOffsetEm}em`, opacity: 0 }}
              animate={
                inView
                  ? { y: 0, opacity: 1 }
                  : { y: `${yOffsetEm}em`, opacity: 0 }
              }
              transition={{
                duration: 0.12,
                delay: delay + i * 0.01,
                ease: [0.2, 0.65, 0.3, 0.9],
              }}
              style={{
                whiteSpace: "normal", // allow wrapping between words
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </As>
  );
}
