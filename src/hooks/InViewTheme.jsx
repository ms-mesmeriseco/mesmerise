"use client";

import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";

export default function InViewTheme({
  children,
  theme = {},
  transitionDuration = "0.3s",
  transitionEasing = "ease-in-out",
  amount = 0.5,
  as: Tag = "div",
  className,
  ...props
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount });

  // Inject a transition style on the properties being animated
  useEffect(() => {
    const properties = Object.keys(theme);
    if (properties.length === 0) return;

    const styleId = "in-view-theme-transitions";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    // CSS custom properties themselves can't be transitioned directly,
    // so we transition the properties on the elements that USE them.
    // Add transition to body (or whatever consumes the vars).
    styleEl.textContent = `
      body, :root * {
        transition:
          background-color ${transitionDuration} ${transitionEasing},
          color ${transitionDuration} ${transitionEasing},
          border-color ${transitionDuration} ${transitionEasing},
          fill ${transitionDuration} ${transitionEasing},
          stroke ${transitionDuration} ${transitionEasing};
      }
    `;

    return () => styleEl?.remove();
  }, [transitionDuration, transitionEasing]);

  useEffect(() => {
    const root = document.documentElement;

    if (inView) {
      Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    } else {
      Object.keys(theme).forEach((key) => {
        root.style.removeProperty(key);
      });
    }

    return () => {
      Object.keys(theme).forEach((key) => {
        root.style.removeProperty(key);
      });
    };
  }, [inView]);

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
}
