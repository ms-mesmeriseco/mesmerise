"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StaggeredWords({
  text,
  className = "",
  delay = 0.02,
  as: As = "h1",
  gradient = false,
  margin = "top 80%", // Triggers when top of text hits 85% of viewport
  once = true,
  // Optional override; by default the line-height comes from the CSS class
  // (so breakpoint-specific line-heights in globals.css still apply)
  leading,
  yOffset = 30, // Pixels to slide up
}) {
  const containerRef = useRef(null);
  const wordsRef = useRef([]);
  const safeText = typeof text === "string" ? text : "";
  // "\n" in the text forces a line break; each line is split into words
  const lines = safeText.split("\n").map((line) => line.split(" ").filter(Boolean));
  let wordIndex = 0; // running index across lines, for wordsRef

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
      stagger: delay, // The 'Agency' secret: fast stagger
      ease: "expo.out", // High-end smoothing

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
      {lines.map((line, l) => (
        <span
          key={l}
          style={{ display: "block", whiteSpace: "normal", textWrap: "balance" }}
        >
          {line.map((word, w) => {
            const i = wordIndex++;
            return (
              <span key={w}>
                <span
                  ref={(el) => (wordsRef.current[i] = el)}
                  className={`inline-block align-baseline will-change-[transform,filter,opacity] ${wordClass}`}
                >
                  {word}
                </span>
                {/* A real space (not &nbsp;) so word gaps are full width and lines can wrap */}
                {w < line.length - 1 && " "}
              </span>
            );
          })}
        </span>
      ))}
    </As>
  );
}
