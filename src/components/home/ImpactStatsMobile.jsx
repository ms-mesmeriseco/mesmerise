"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import StaggeredWords from "@/hooks/StaggeredWords";
import InView from "@/hooks/InView";

export default function ImpactStatsMobile() {
  const stats = useMemo(
    () => [
      {
        title: "$10M+",
        sub: "Total client revenue",
        body: "Real results over the last 3 years. Money in the bank, not just numbers on a report.",
      },
      {
        title: "25X",
        sub: "Average ROAS",
        body: "Most of our clients see a 25X return on ad spend, with a few breaking records and hitting 100X. That means every time someone puts in $1 they get back $25. If you find a better investment let us know.",
      },
      {
        title: "3,000%",
        sub: "More website traffic",
        body: "From zero to hero. Some clients see a staggering 7,998% increase in traffic. That’s a lot of eyeballs.",
      },
      {
        title: "874%",
        sub: "Average enquiries increase",
        body: "No more waiting for the phone to ring. Clients move from chasing work to switching off the phone until they can hire more staff. At the top end, enquiries grew by 2,800%.",
      },
    ],
    []
  );

  const itemRefs = useRef([]);
  const [activeIdx, setActiveIdx] = useState(0);

  // ————— anti-flicker controls —————
  const activeRef = useRef(activeIdx);
  useEffect(() => {
    activeRef.current = activeIdx;
  }, [activeIdx]);

  const lastSwitchRef = useRef(0);
  const SWITCH_GATE_MS = 300; // at most one switch each 0.5s
  const RATIO_MARGIN = 0.06; // new card must beat current by 6%

  useEffect(() => {
    const els = itemRefs.current.filter(Boolean);
    if (!els.length) return;

    const latestRatios = new Map();

    const trySwitch = () => {
      if (!latestRatios.size) return;

      // find best candidate
      let bestIdx = activeRef.current;
      let best = latestRatios.get(bestIdx) ?? 0;

      latestRatios.forEach((ratio, idx) => {
        if (ratio > best) {
          best = ratio;
          bestIdx = idx;
        }
      });

      // hysteresis: require a clear win over current
      const currentIdx = activeRef.current;
      const current = latestRatios.get(currentIdx) ?? 0;
      const now = performance.now();

      const clearWin = best > current + RATIO_MARGIN;
      const gateOpen = now - lastSwitchRef.current >= SWITCH_GATE_MS;

      if (bestIdx !== currentIdx && clearWin && gateOpen) {
        lastSwitchRef.current = now;
        setActiveIdx(bestIdx);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const idx = Number(e.target.getAttribute("data-index"));
          latestRatios.set(idx, e.intersectionRatio);
        }
        // throttle to one RAF to avoid bursty setState
        if (!queuedRaf.current) {
          queuedRaf.current = requestAnimationFrame(() => {
            queuedRaf.current = null;
            trySwitch();
          });
        }
      },
      {
        root: null,
        // encourage “center lock” but with slightly larger margins to reduce ping-pong
        rootMargin: "-30% 0px -30% 0px",
        // coarser thresholds reduce jitter
        threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
      }
    );

    const queuedRaf = { current: null };
    els.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      if (queuedRaf.current) cancelAnimationFrame(queuedRaf.current);
    };
  }, [stats.length]);

  const container = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.06 },
    },
  };

  return (
    <section
      data-marker="RESULTS"
      className="relative md:hidden py-10 text-white"
    >
      <InView>
        <motion.div
          variants={container}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          // ↑ more space: reduce accidental tie scores between neighbors
          className="grid grid-cols-1 gap-6 sm:gap-7"
        >
          {stats.map((s, idx) => {
            const expanded = idx === activeIdx;
            return (
              <article
                key={idx}
                ref={(el) => (itemRefs.current[idx] = el)}
                data-index={idx}
                className="border border-[var(--mesm-grey-dk)] rounded-lg bg-black/20"
              >
                <div className="p-5">
                  <StaggeredWords
                    as="h3"
                    className="font-semibold leading-tight page-title-xl"
                    text={s.title}
                  />
                  <p className="text-base opacity-80 mt-1">{s.sub}</p>
                </div>

                <motion.div
                  initial={false}
                  animate={{
                    height: expanded ? "auto" : 0,
                    opacity: expanded ? 1 : 0,
                  }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="overflow-hidden border-t border-[var(--mesm-grey-dk)]"
                >
                  <div className="p-5">
                    <p className="p2 opacity-90">{s.body}</p>
                  </div>
                </motion.div>
              </article>
            );
          })}
        </motion.div>
      </InView>
    </section>
  );
}
