"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [scrollTimeoutId, setScrollTimeoutId] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setShowHeader(false);

      if (scrollTimeoutId) {
        clearTimeout(scrollTimeoutId);
      }

      const timeoutId = setTimeout(() => {
        setShowHeader(true);
      }, 300);

      setScrollTimeoutId(timeoutId);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutId) {
        clearTimeout(scrollTimeoutId);
      }
    };
  }, [scrollTimeoutId]);

  return (
    <AnimatePresence>
      {showHeader && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "tween", duration: 0.2, delay: 0.1 }}
          className="fixed z-50 flex flex-row justify-between items-center w-full p-(--global-margin) box-border bg-[var(--background)]"
        >
          <span className="w-1/3">
            <a href="../">
              <img
                src="/LogoMark.png"
                alt="MESMERISE Logo"
                className="w-[80px] h-auto"
              />
            </a>
          </span>
          <span>this will be site menu</span>
          <span>
            <button className="bg-white text-[var(--foreground)] px-4 py-0 rounded-lg">
              CTA
            </button>
          </span>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
