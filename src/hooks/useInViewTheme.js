import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export function useInViewTheme(theme = {}, options = { amount: 0.2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, options);

  useEffect(() => {
    const root = document.documentElement;

    if (inView) {
      Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    } else {
      // Reset to empty string so CSS cascade falls back to :root defaults
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

  return ref;
}
