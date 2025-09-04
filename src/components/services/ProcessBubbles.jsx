"use client";

import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import PageTitleMedium from "../layout/PageTitleMedium";

function splitToChars(str = "") {
  return [...str].map((ch) => (ch === " " ? "\u00A0" : ch));
}

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

function BubbleItem({
  item,
  isOpen,
  isMobile,
  width,
  maxItemWidth,
  spring,
  onToggle,
}) {
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
    if (isMobile) {
      if (mode !== "horizontal") setMode("horizontal");
      return;
    }
    if (desired !== mode) setFlipSignal((n) => n + 1);
  }, [isOpen, isMobile]); // eslint-disable-line

  const writingMode = mode === "vertical" ? "sideways-lr" : "horizontal-tb";

  // ----- COLORS (simple) -----
  const bubbleColorClasses = isOpen
    ? "bg-[var(--background)] text-[var(--mesm-l-grey)] border-1 border-[var(--mesm-grey-dk)] "
    : "bg-[var(--mesm-yellow)] text-[var(--background)] border-1 border-[var(--mesm-grey-dk)] hover:bg-[var(--background)] hover:text-[var(--mesm-l-grey)] duration-150";

  return (
    <motion.div
      layout
      transition={spring}
      className="relative"
      style={{ width, maxWidth: isMobile ? "100%" : maxItemWidth }}
    >
      <motion.button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        layout
        transition={spring}
        className={[
          "justify-center select-none outline-none focus-visible:ring-2 focus-visible:ring-black/10",
          "whitespace-nowrap cursor-pointer rounded-2xl px-3 py-1 font-normal transition leading-none",
          bubbleColorClasses, // ← here
        ].join(" ")}
        style={{
          // force horizontal on mobile
          writingMode: isMobile ? "horizontal-tb" : writingMode,
          textOrientation: "mixed",
        }}
      >
        <span className="md:text-[72px] text-[36px]">
          {isMobile ? (
            item.title
          ) : (
            <StaggeredChars
              text={item.title}
              flipSignal={flipSignal}
              spring={spring}
              onFlip={() => setMode(isOpen ? "horizontal" : "vertical")}
            />
          )}
        </span>
      </motion.button>

      <AnimatePresence initial={false} mode="popLayout">
        {isOpen && (
          <motion.div
            key="content"
            layout="position"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={spring}
            className="mt-3 rounded-xl p-4 text-left bg-[var(--background)] text-[var(--mesm-l-grey)] border-1 border-[var(--mesm-grey-dk)] "
            style={{
              maxWidth: isMobile ? "100%" : maxItemWidth,
              backdropFilter: "saturate(140%) blur(4px)",
            }}
          >
            <span
              className={`${
                isMobile ? "text-md" : "text-5xl"
              } leading-relaxed p2`}
            >
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
  maxItemWidth = 645,
  collapsedWidth = 80,
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
    () => ({ type: "spring", stiffness: 500, damping: 20, mass: 0.05 }),
    []
  );

  return (
    <section className="w-full">
      <motion.div
        layout
        transition={spring}
        className="flex w-full flex-wrap items-start content-start gap-3"
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
