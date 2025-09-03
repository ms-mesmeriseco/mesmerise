"use client";

import { motion, useInView } from "framer-motion";
import { useRef, Children } from "react";

export default function StaggeredChildren({
  children,
  as: As = "div",
  className = "",
  itemClassName = "",
  baseDelay = 0.5,
  perItem = 0.02,
  duration = 0.15,
  once = true,
  margin = "-40% 0px",
  inline = false,
  y = "0.1em",
  blur = 4,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin });

  const items = Children.toArray(children).filter(Boolean);

  return (
    <As ref={ref} className={className}>
      {items.map((child, i) => {
        // Keep semantics for list items; otherwise choose span|div by `inline`
        const isLi = typeof child === "object" && child?.type === "li";
        const Wrapper = isLi ? motion.li : inline ? motion.span : motion.div;

        return (
          <Wrapper
            key={i}
            className={`will-change-transform ${itemClassName}`}
            style={{
              display: isLi ? undefined : inline ? "inline-block" : "block",
              whiteSpace: inline ? "nowrap" : undefined,
            }}
            initial={{ y, opacity: 0, filter: `blur(${blur}px)` }}
            animate={
              inView
                ? { y: 0, opacity: 1, filter: "blur(0px)" }
                : { y, opacity: 0, filter: `blur(${blur}px)` }
            }
            transition={{
              duration,
              delay: baseDelay + i * perItem,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
          >
            {child}
          </Wrapper>
        );
      })}
    </As>
  );
}
