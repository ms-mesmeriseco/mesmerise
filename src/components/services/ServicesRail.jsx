"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ServicesRail
 * - Horizontal, snap-scrolling rail for five offerings
 * - Focus/hover the centered card like ProjectRail
 * - No media; uses subtle backgrounds + accent ring
 *
 * Props:
 * - services: [{ title, blurb, href, accent? (css var or hex), tag? (small label) }]
 * - heading?: string
 */
export default function ServicesRail({
  heading = "What we do",
  services = [
    {
      title: "Strategy",
      blurb: "A successful business starts with clarity",
      href: "/services/strategy",
      accent: "var(--mesm-yellow)",
      tag: "",
    },
    {
      title: "Branding",
      blurb: "Build trust in the blink of an eye",
      href: "/services/branding",
      accent: "var(--mesm-red)",
      tag: "2.",
    },
    {
      title: "Website",
      blurb: "We build expressive websites that engage and convert",
      href: "/services/website",
      accent: "var(--mesm-blue)",
      tag: "Web",
    },
    {
      title: "Performance & Growth",
      blurb: "Attention is fleeting, trust is not",
      href: "/services/performance-growth",
      accent: "var(--mesm-yellow)",
      tag: "Growth",
    },
    {
      title: "Analytics",
      blurb: "When you understand the data, decision-making becomes simple",
      href: "/services/analytics",
      accent: "var(--mesm-blue)",
      tag: "Data",
    },
  ],
}) {
  const scrollerRef = useRef(null);
  const cardsRef = useRef([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [centerIndex, setCenterIndex] = useState(0);

  const items = useMemo(() => services.slice(0, 5), [services]);

  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, items.length);
  }, [items.length]);

  const updateCenter = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || cardsRef.current.length === 0) return;
    const rect = scroller.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    let bestIdx = 0;
    let bestDist = Infinity;
    cardsRef.current.forEach((el, idx) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const d = Math.abs(cardCenter - centerX);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = idx;
      }
    });
    setCenterIndex(bestIdx);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onScroll = () => updateCenter();
    const onResize = () => updateCenter();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    updateCenter(); // initial
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [updateCenter]);

  const cardVariants = {
    idle: { scale: 1, opacity: 0.85 },
    focus: {
      scale: 1.02,
      opacity: 1,
      transition: { type: "spring", stiffness: 220, damping: 24 },
    },
  };

  return (
    <section className="w-full">
      {heading && <h6 className="mb-2 opacity-80">{heading}</h6>}
      <div
        ref={scrollerRef}
        className="relative w-full overflow-x-auto overflow-y-visible snap-x snap-mandatory scroll-smooth
                   [scrollbar-width:none] [-ms-overflow-style:none] border-t border-b border-[var(--mesm-grey-dk)]"
        style={{ scrollbarWidth: "none" }}
        aria-label="Services rail"
      >
        <ul className="flex gap-2 py-2 select-none">
          {items.map((svc, i) => {
            const showDetails =
              hoveredIndex === i || (hoveredIndex == null && centerIndex === i);
            const accent = svc.accent || "var(--mesm-yellow)";

            return (
              <li
                key={svc.href || svc.title}
                ref={(el) => (cardsRef.current[i] = el)}
                className="relative snap-center shrink-0 focus:outline-none no-list px-1"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(i)}
                onBlur={() => setHoveredIndex(null)}
                tabIndex={0}
                aria-selected={showDetails}
              >
                <motion.div
                  variants={cardVariants}
                  animate={showDetails ? "focus" : "idle"}
                  className="relative w-[76vw] sm:w-[52vw] md:w-[40vw] lg:w-[26vw]"
                >
                  {/* Card body (no media) */}
                  <div
                    className="relative aspect-[2/3] overflow-hidden rounded-lg border border-[var(--mesm-grey-dk)] bg-black/20"
                    style={{
                      // subtle angled sheen + accent ring on focus
                      //   backgroundImage:
                      //     "linear-gradient(120deg, rgba(255,255,255,0.06) 0%, transparent 35%), radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 60%)",
                      boxShadow: showDetails
                        ? `0 0 0 1px var(--mesm-grey-dk), 0 0 0 2px ${accent}33 inset`
                        : "none",
                    }}
                  >
                    {/* Always-visible top content */}
                    <div className="absolute inset-0 p-3 flex flex-col justify-between h-[60px] ">
                      <div className="flex items-center gap-2">
                        {/* {svc.tag && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--mesm-grey-dk)] opacity-80"
                            style={{ background: "#00000040" }}
                          >
                            {svc.tag}
                          </span>
                        )} */}
                      </div>

                      <div className="mb-auto mt-[10px]">
                        <h3 className="text-lg md:text-xl font-semibold leading-tight">
                          {svc.title}
                        </h3>
                      </div>
                    </div>

                    {/* Overlay details (hovered or centered) */}
                    <AnimatePresence>
                      {showDetails && (
                        <Link
                          href={svc.href}
                          className="absolute inset-0 block focus:outline-none mt-auto"
                          aria-label={`Learn more about ${svc.title}`}
                        >
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/45 backdrop-blur-[2px] text-white p-3 flex flex-col justify-between mt-[120px]"
                          >
                            <div className="space-y-2">
                              {svc.blurb && (
                                <p className="p2 opacity-60 max-w-[90%]">
                                  {svc.blurb}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block h-2 w-2 rounded-full"
                                style={{ background: accent }}
                              />
                              <span className="underline underline-offset-4">
                                Learn more
                              </span>
                            </div>
                          </motion.div>
                        </Link>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
