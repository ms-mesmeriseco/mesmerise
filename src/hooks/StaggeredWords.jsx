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
  small,
  margin = "-10% 0px",
  once = true,
}) {
  const safeText = typeof text === "string" ? text : "";
  const words = safeText.split(" ");
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin });

  const wordClass = gradient
    ? "bg-linear-40 from-[var(--mesm-red)] to-[var(--dark-grey)] bg-clip-text text-transparent"
    : "";

  // Wrapper class (for glass effect)
  const wrapperClass = glass
    ? "px-4 py-1 rounded-4xl border border-white/20 bg-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] text-stroke"
    : "";

  return (
    <As className={className}>
      <span
        ref={ref}
        className={`inline-block align-top ${wrapperClass}`}
        style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            className={`inline-block will-change-transform ${wordClass}`}
            initial={{ y: "0.1em", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: "0.1em", opacity: 0 }}
            transition={{
              duration: 0.3,
              delay: delay + i * 0.06,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </span>
    </As>
  );
}
