"use client";

import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

/* Split to renderable chars (preserve spaces) */
function splitToChars(str = "") {
  return [...str].map((ch) => (ch === " " ? "\u00A0" : ch));
}

/* Staggered IN only:
   - on flipSignal change: instantly hide all chars
   - call onFlip() so parent can switch writing-mode
   - then stagger them back in */
function StaggeredChars({ text, flipSignal, spring, onFlip }) {
  const controls = useAnimation();

  const container = {
    hidden: { transition: { when: "beforeChildren", staggerChildren: 0 } },
    in: { transition: { when: "beforeChildren", staggerChildren: 0.02 } },
  };

  const char = {
    hidden: { opacity: 0, y: 0, scale: 1 },
    in: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.16 } },
  };

  // Show immediately on mount
  useEffect(() => {
    controls.set("in");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 1) instantly hide chars
    controls.set("hidden");
    // 2) tell parent to flip writing-mode
    onFlip?.();
    // 3) next frame: stagger back in (ensures layout has flipped first)
    const id = requestAnimationFrame(() => controls.start("in"));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipSignal]);

  return (
    <motion.span
      variants={container}
      initial="in"
      animate={controls}
      transition={spring}
      style={{ display: "inline-flex" }}
    >
      {splitToChars(text).map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          variants={char}
          style={{ display: "inline-block" }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* One bubble (keeps your exact styling) */
function BubbleItem({
  item,
  isOpen,
  isMobile,
  width,
  maxItemWidth,
  color,
  spring,
  onToggle,
}) {
  // Local writing-mode we actually render with (flips AFTER instant hide)
  const [mode, setMode] = useState(
    isMobile ? "horizontal" : isOpen ? "horizontal" : "vertical"
  );
  const [flipSignal, setFlipSignal] = useState(0);

  useEffect(() => {
    const desired = isMobile
      ? "horizontal"
      : isOpen
      ? "horizontal"
      : "vertical";
    if (desired !== mode) setFlipSignal((n) => n + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isMobile]);

  const writingMode = mode === "vertical" ? "vertical-rl" : "horizontal-tb";

  return (
    <motion.div
      layout
      transition={spring}
      className="relative"
      style={{ width, maxWidth: isMobile ? "100%" : maxItemWidth }}
    >
      {/* Button (styling preserved) */}
      <motion.button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        layout
        transition={spring}
        className={[
          "w-full select-none font-medium text-[var(--background)]",
          "rounded-lg shadow-md",
          "px-2 py-4 md:px-4 md:py-2",
          "outline-none focus-visible:ring-2 focus-visible:ring-black/10",
          "whitespace-nowrap",
        ].join(" ")}
        style={{
          backgroundColor: color,
          writingMode, // vertical when collapsed (desktop), horizontal when open
          textOrientation: "mixed",
        }}
      >
        <h2>
          {isMobile ? (
            item.title
          ) : (
            <StaggeredChars
              text={item.title}
              flipSignal={flipSignal}
              spring={spring}
              onFlip={() =>
                setMode(
                  isMobile ? "horizontal" : isOpen ? "horizontal" : "vertical"
                )
              }
            />
          )}
        </h2>
      </motion.button>

      {/* Expanded content (styling preserved) */}
      <AnimatePresence initial={false} mode="popLayout">
        {isOpen && (
          <motion.div
            key="content"
            layout="position"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={spring}
            className="mt-3 rounded-lg bg-[var(--mesm-yellow)] p-4 text-left "
            style={{
              maxWidth: isMobile ? "100%" : maxItemWidth,
              backdropFilter: "saturate(140%) blur(4px)",
            }}
          >
            <span className="text-xl leading-relaxed text-[var(--background)]">
              {item.content}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProcessBubbles({
  items = [],
  color = "var(--mesm-blue, #274CFF)",
  maxItemWidth = 480,
  collapsedWidth = 64,
}) {
  const [openSet, setOpenSet] = useState(() => new Set());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    mq.addListener?.(apply);
    return () => {
      mq.removeEventListener?.("change", apply);
      mq.removeListener?.(apply);
    };
  }, []);

  const toggle = (i) =>
    setOpenSet((prev) => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });

  const spring = useMemo(
    () => ({ type: "spring", stiffness: 420, damping: 36, mass: 0.9 }),
    []
  );

  return (
    <section className="w-full">
      <motion.div
        layout
        transition={spring}
        className="flex w-full flex-wrap items-start content-start gap-2"
      >
        {items.map((it, idx) => {
          const isOpen = openSet.has(idx);
          const width = isMobile
            ? "100%"
            : isOpen
            ? maxItemWidth
            : collapsedWidth;

          return (
            <BubbleItem
              key={idx}
              item={it}
              isOpen={isOpen}
              isMobile={isMobile}
              width={width}
              maxItemWidth={maxItemWidth}
              color={color}
              spring={spring}
              onToggle={() => toggle(idx)}
            />
          );
        })}
      </motion.div>
    </section>
  );
}

ProcessBubbles.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ),
  color: PropTypes.string,
  maxItemWidth: PropTypes.number,
  collapsedWidth: PropTypes.number,
};
