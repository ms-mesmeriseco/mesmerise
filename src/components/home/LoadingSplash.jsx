"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

const phrases = [
  "ཐི༏ཋྀ",
  "¯_(ツ)_/¯ ",
  "̿' ̿'̵͇̿̿з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿",
  "[♥]]] [♦]]] [♣]]] [♠]]]",
];
const MIN_DURATION_MS = 6000;
const SWITCH_MS = 1223;

export default function LoadingSplash({ isSceneLoaded }) {
  const [index, setIndex] = useState(0);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // mount flag for portal
  useEffect(() => setMounted(true), []);

  // cycle phrases
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, SWITCH_MS);
    return () => clearInterval(id);
  }, []);

  // minimum display duration
  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), MIN_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  const visible = !(minTimePassed && isSceneLoaded);

  // lock body scroll while visible
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  const node = (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="splash"
          // render above EVERYTHING
          className="fixed inset-0 z-[2147483647] flex h-screen w-screen flex-col items-center justify-center gap-4 bg-[var(--mesm-yellow)]"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          // ensure own stacking context (belt & braces)
          style={{ willChange: "opacity, transform" }}
          aria-live="polite"
          role="status"
        >
          {/* phrases */}
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              className="text-black text-xs font-normal"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {phrases[index]}
            </motion.span>
          </AnimatePresence>

          {/* loading bar */}
          <div className="w-56 h-2 rounded-full border border-black/70 overflow-hidden">
            <motion.div
              className="h-full bg-black"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: MIN_DURATION_MS / 1000, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Portal to <body> so header/menu can't cover it
  return mounted ? createPortal(node, document.body) : null;
}
