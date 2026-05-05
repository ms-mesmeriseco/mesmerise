"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StaggeredWords({
  text,
  className = "",
  delay = 0.2,
  as: As = "h1",
  gradient = false,
  margin = "top 80%", // Triggers when top of text hits 85% of viewport
  once = true,
  leading = 1.15,
  yOffset = 30, // Pixels to slide up
}) {
  const containerRef = useRef(null);
  const wordsRef = useRef([]);
  const safeText = typeof text === "string" ? text : "";
  const words = safeText.split(" ");

  const wordClass = gradient
    ? "bg-linear-40 from-[var(--mesm-red)] to-[var(--dark-grey)] bg-clip-text text-transparent"
    : "";

  useEffect(() => {
    // 1. Set initial state: shifted down, blurry, and transparent
    gsap.set(wordsRef.current, {
      y: yOffset,
      opacity: 0,
      // filter: "blur(4px)",
      scale: 0.95,
    });

    // 2. Create the reveal timeline
    const tl = gsap.to(wordsRef.current, {
      y: 0,
      opacity: 1,
      // filter: "blur(0px)",
      scale: 1,
      duration: 0.2,
      stagger: 0.04, // The 'Agency' secret: fast stagger
      ease: "expo.out", // High-end smoothing
      delay: delay,
      scrollTrigger: {
        trigger: containerRef.current,
        start: margin,
        toggleActions: once
          ? "play none none none"
          : "play reverse play reverse",
      },
    });

    return () => {
      tl.kill();
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
    };
  }, [delay, margin, once, yOffset]);

  return (
    <As
      ref={containerRef}
      className={className}
      style={{
        lineHeight: leading,
        overflow: "visible",
      }}
    >
      <span style={{ display: "block", whiteSpace: "normal" }}>
        {words.map((word, i) => (
          <span key={i} style={{ display: "inline-block" }}>
            <span
              ref={(el) => (wordsRef.current[i] = el)}
              className={`inline-block align-baseline will-change-[transform,filter,opacity] ${wordClass}`}
              style={{ whiteSpace: "normal" }}
            >
              {word}
            </span>
            {/* Add space between words */}
            {i < words.length - 1 && (
              <span style={{ display: "inline-block" }}>&nbsp;</span>
            )}
          </span>
        ))}
      </span>
    </As>
  );
}
