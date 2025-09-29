"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import StaggeredWords from "@/hooks/StaggeredWords";
import InView from "@/hooks/InView";

/* Colors for the floating card only */
const CARD_BG_CLASSES = [
  "bg-[var(--mesm-red)]",
  "bg-[var(--mesm-yellow)]",
  "bg-[var(--accent)]",
  "bg-[var(--accent2)]",
];
const CARD_TEXT_CLASSES = [
  "text-white",
  "text-black", // better contrast for yellow
  "text-white",
  "text-white",
];

function StatCard({
  title,
  sub,
  index,
  onPointer,
  onEnter,
  onLeave,
  onToggleTouch,
}) {
  const ref = useRef(null);

  const handleMove = (e) => {
    onPointer?.({ x: e.clientX, y: e.clientY, index });
  };
  const handleEnter = () => onEnter?.(index);
  const handleLeave = () => onLeave?.();
  const handleTouchStart = (e) => {
    const t = e.touches?.[0];
    onToggleTouch?.({ x: t?.clientX ?? 0, y: t?.clientY ?? 0, index });
  };

  return (
    <motion.article
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      onTouchStart={handleTouchStart}
      className="relative flex flex-col justify-between border border-[var(--mesm-grey-dk)] rounded-lg p-6 md:p-7 gap-3 bg-black/20 hover:bg-white/5 transition-colors cursor-default"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <StaggeredWords
        as="h3"
        className="font-semibold leading-tight page-title-xl"
        text={title}
      />
      <p className="text-base md:text-lg opacity-80">{sub}</p>
    </motion.article>
  );
}

/* Renders the floating card above everything via a portal */
function FloatingCard({ visible, x, y, index, body }) {
  const W = 360; // fixed width (px)
  const PADDING = 12; // cursor offset
  const bgClass = CARD_BG_CLASSES[index % CARD_BG_CLASSES.length];
  const textClass = CARD_TEXT_CLASSES[index % CARD_TEXT_CLASSES.length];

  // Clamp to viewport so it doesn't go offscreen
  const [coords, setCoords] = useState({ left: 0, top: 0 });
  useEffect(() => {
    if (!visible) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const left = Math.min(Math.max(8, x + PADDING), vw - W - 8);
    const top = Math.min(Math.max(8, y + PADDING), vh - 120); // leave some room at bottom
    setCoords({ left, top });
  }, [visible, x, y]);

  if (!visible) return null;

  return createPortal(
    <motion.div
      role="tooltip"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={[
        "fixed z-[9999] pointer-events-none",
        "rounded-xl border border-[var(--mesm-grey-dk)] shadow-2xl backdrop-blur-sm",
        bgClass,
        textClass,
      ].join(" ")}
      style={{
        left: coords.left,
        top: coords.top,
        width: `${W}px`,
        maxWidth: "90vw",
      }}
    >
      <div className="px-4 py-3">
        <p className="p2 opacity-95">{body}</p>
      </div>
    </motion.div>,
    document.body
  );
}

export default function ImpactStats() {
  const stats = [
    {
      title: "$10M+",
      sub: "Total client revenue",
      body: "Real results over the last 3 years. Money in the bank, not just numbers on a report.",
    },
    {
      title: "25X",
      sub: "Average ROAS",
      body: "Most of our clients see a 25X return on ad spend, with a few breaking records and hitting 100X...",
    },
    {
      title: "3,000%",
      sub: "More website traffic",
      body: "From zero to hero. Some clients see a staggering 7,998% increase in traffic.",
    },
    {
      title: "874%",
      sub: "Average enquiries increase",
      body: "Clients move from chasing work to hiring more staff. At the top end, enquiries grew by 2,800%.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Hide on scroll (optional)
  useEffect(() => {
    const onScroll = () => setActiveIndex(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const container = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.08 },
    },
  };

  return (
    <section
      data-marker="RESULTS"
      className="relative py-12 md:py-16 text-white"
    >
      <InView>
        <motion.div
          variants={container}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[var(--global-margin-xs)]"
        >
          {stats.map((s, idx) => (
            <StatCard
              key={idx}
              index={idx}
              title={s.title}
              sub={s.sub}
              onPointer={({ x, y }) => {
                setPos({ x, y });
                if (activeIndex === null) setActiveIndex(idx);
              }}
              onEnter={(i) => setActiveIndex(i)}
              onLeave={() => setActiveIndex(null)}
              onToggleTouch={({ x, y, index }) => {
                setPos({ x, y });
                setActiveIndex((prev) => (prev === index ? null : index));
              }}
            />
          ))}
        </motion.div>
      </InView>

      {/* One global floating card rendered above everything */}
      <FloatingCard
        visible={activeIndex !== null}
        x={pos.x}
        y={pos.y}
        index={activeIndex ?? 0}
        body={activeIndex !== null ? stats[activeIndex].body : ""}
      />
    </section>
  );
}
