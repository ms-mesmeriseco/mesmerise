"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, Children, isValidElement } from "react";

export default function StaggeredChildren({
  children,
  as: As = "div",
  className = "",
  itemClassName = "",
  baseDelay = 0,
  perItem = 0.05, // Slightly slower for better visual rhythm
  duration = 0.5,
  once = true,
  margin = "-10%",
  inline = false,
  y = 15, // Using numbers is safer for Framer than strings
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin });

  const items = Children.toArray(children).filter(Boolean);

  return (
    <As ref={ref} className={className}>
      {items.map((child, i) => {
        // Determine the motion component type
        let MotionComponent = motion.div;
        if (inline) MotionComponent = motion.span;
        if (isValidElement(child) && child.type === "li")
          MotionComponent = motion.li;

        return (
          <MotionComponent
            key={i}
            className={itemClassName}
            initial={{ opacity: 0, y }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
            transition={{
              duration,
              delay: baseDelay + i * perItem,
              ease: [0.215, 0.61, 0.355, 1], // Standard "out-cubic" for smooth entry
            }}
            style={{
              display: inline ? "inline-block" : undefined,
              // If it's a grid child, we usually want it to stay 'block'
            }}
          >
            {child}
          </MotionComponent>
        );
      })}
    </As>
  );
}
