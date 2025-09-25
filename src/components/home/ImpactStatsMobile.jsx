"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import StaggeredWords from "@/hooks/StaggeredWords";
import InView from "@/hooks/InView";

/**
 * Mobile-only Impact Stats
 * - As you scroll, whichever stat is most in view auto-expands its body inline.
 * - Hidden on md+ screens.
 */
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

  // Track which stat is most in view
  const itemRefs = useRef([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const els = itemRefs.current.filter(Boolean);
    if (!els.length) return;

    // Use a single observer; pick the element with the highest intersection ratio
    let latestRatios = new Map();
    const pickActive = () => {
      if (!latestRatios.size) return;
      let best = 0;
      let bestIdx = 0;
      latestRatios.forEach((ratio, idx) => {
        if (ratio > best) {
          best = ratio;
          bestIdx = idx;
        }
      });
      setActiveIdx(bestIdx);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const idx = Number(e.target.getAttribute("data-index"));
          latestRatios.set(idx, e.intersectionRatio);
        }
        pickActive();
      },
      {
        // Favor the middle of the viewport
        root: null,
        threshold: Array.from({ length: 11 }, (_, i) => i / 10), // 0..1
        rootMargin: "-20% 0px -20% 0px", // encourage middle-lock
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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
          className="grid grid-cols-1 gap-[var(--global-margin-xs)]"
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
                {/* Header row */}
                <div className="p-5">
                  <StaggeredWords
                    as="h3"
                    className="font-semibold leading-tight page-title-xl"
                    text={s.title}
                  />
                  <p className="text-base opacity-80 mt-1">{s.sub}</p>
                </div>

                {/* Expanding body that appears automatically for the active item */}
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
