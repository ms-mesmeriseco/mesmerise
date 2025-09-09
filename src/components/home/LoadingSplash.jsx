// components/LoadingSplash.jsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const phrases = [
  "ཐི༏ཋྀ",
  "¯_(ツ)_/¯ ",
  "̿' ̿'̵͇̿̿з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿",
  "[♥]]] [♦]]] [♣]]] [♠]]]",
];
const DURATION_MS = 7723; // total time on screen
const SWITCH_MS = 1223; // phrase cadence

export default function LoadingSplash() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // cycle phrases
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, SWITCH_MS);
    return () => clearInterval(id);
  }, []);

  // keep splash for exactly 6s
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center gap-4 bg-[var(--mesm-yellow)]"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
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
              transition={{ duration: DURATION_MS / 1000, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
