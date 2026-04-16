"use client";

import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";

export default function InViewTheme({
  children,
  theme = {},
  amount = 0.4,
  as: Tag = "div",
  className,
  ...props
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount });

  useEffect(() => {
    console.log(
      "[InViewTheme] mounted, ref:",
      ref.current,
      "theme:",
      theme,
      "amount:",
      amount,
    );
    return () => console.log("[InViewTheme] unmounted");
  }, []);

  useEffect(() => {
    console.log(
      "[InViewTheme] inView changed →",
      inView,
      "| ref.current:",
      ref.current,
    );

    const root = document.documentElement;

    if (inView) {
      console.log("[InViewTheme] IN VIEW — setting properties:", theme);
      Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(key, value);
        console.log(
          `  set ${key} = ${value} | confirmed:`,
          root.style.getPropertyValue(key),
        );
      });
    } else {
      console.log(
        "[InViewTheme] OUT OF VIEW — removing properties:",
        Object.keys(theme),
      );
      Object.keys(theme).forEach((key) => {
        root.style.removeProperty(key);
        console.log(
          `  removed ${key} | confirmed:`,
          root.style.getPropertyValue(key) || "(cleared)",
        );
      });
    }

    return () => {
      console.log("[InViewTheme] cleanup — removing properties");
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
