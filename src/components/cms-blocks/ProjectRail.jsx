"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getClient } from "@/lib/apollo-client";
import { GET_PROJECT_PAGES } from "@/lib/graphql/queries/getProjectPages";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";
import addClassToParagraphs from "@/lib/utils/addClassToParagraphs";

function hasTag(project, { tagName, tagSlug }) {
  const tags = project?.contentfulMetadata?.tags || [];
  return tags.some((t) => {
    const name = (t?.name || "").toLowerCase().trim();
    const id = (t?.id || t?.sys?.id || "").toLowerCase().trim();
    return (
      (tagName && name === tagName.toLowerCase().trim()) ||
      (tagSlug && id.includes(tagSlug.toLowerCase().trim()))
    );
  });
}

export default function ProjectRail({
  tagName = "layout: highlight grid",
  tagSlug = "layout-highlight-grid", // fallback if your space uses slugged tag ids
  max = 6,
}) {
  const [projects, setProjects] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [centerIndex, setCenterIndex] = useState(0);

  // NEW: disable state for the two circle buttons
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const scrollerRef = useRef(null);
  const cardsRef = useRef([]);

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data } = await getClient().query({ query: GET_PROJECT_PAGES });
        setProjects(data?.projectPageCollection?.items || []);
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setIsLoaded(true);
      }
    }
    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    const byTag = projects.filter((p) => hasTag(p, { tagName, tagSlug }));
    return byTag.slice(0, max);
  }, [projects, tagName, tagSlug, max]);

  // Ensure we always render 6 slots to preserve layout (if you still want this)
  const slots = useMemo(() => {
    const arr = filtered.slice(0, 6);
    while (arr.length < 6) arr.push(null);
    return arr;
  }, [filtered]);

  // Keep refs in sync with filtered length
  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, filtered.length);
  }, [filtered.length]);

  // Update which card is closest to center + start/end detection
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

    // NEW: track bounds for button disabled state
    const maxLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const left = scroller.scrollLeft;
    setAtStart(left <= 2);
    setAtEnd(left >= maxLeft - 2);
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
    idle: { scale: 1, opacity: 0.9 },
    focus: {
      scale: 1.02,
      opacity: 1,
      transition: { type: "spring", stiffness: 220, damping: 24 },
    },
  };

  // NEW: fixed-portion scroll helpers (60% of visible width)
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const scrollByAmount = (dir = 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const amount = Math.round(scroller.clientWidth * 0.6); // adjust 0.6 to taste
    const maxLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const target = clamp(scroller.scrollLeft + dir * amount, 0, maxLeft);
    scroller.scrollTo({ left: target, behavior: "smooth" });
  };
  const goPrev = () => scrollByAmount(-1);
  const goNext = () => scrollByAmount(1);

  return (
    <section className="w-full relative">
      <h6>Some of our best work</h6>

      <div
        ref={scrollerRef}
        className="relative w-full overflow-x-auto overflow-y-visible snap-x snap-mandatory scroll-smooth
                   [scrollbar-width:none] [-ms-overflow-style:none] border-t border-b border-[var(--mesm-grey-dk)]"
        style={{ scrollbarWidth: "none" }}
        aria-label="Project rail"
      >
        <ul className="flex gap-2 py-2 select-none">
          {isLoaded && filtered.length === 0 && (
            <li className="text-sm opacity-70">No projects found.</li>
          )}

          {filtered.map((p, i) => {
            const media =
              p.heroMedia || p.featuredMedia || p.coverImage || null;
            const src = media?.url;
            const title = p.projectTitle || p.pageTitle || "Untitled";
            const slug = p.slug;
            const doc = p.dataOne?.json || null;

            const showDetails =
              hoveredIndex === i || (hoveredIndex == null && centerIndex === i);

            return (
              <li
                key={slug || i}
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
                  className="relative w-[70vw] sm:w-[46vw] md:w-[36vw] lg:w-[24vw]"
                >
                  {/* Media with 2:3 aspect */}
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-[var(--mesm-grey-dk)] bg-black/20">
                    {src ? (
                      <Image
                        src={src}
                        alt={media?.title || title}
                        fill
                        className="object-cover"
                        priority={i < 3}
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-xs opacity-70">
                        No media
                      </div>
                    )}

                    {/* Overlay details (hovered or centered) */}
                    <AnimatePresence>
                      {showDetails && (
                        <Link
                          href={`/work/${slug}`}
                          className="underline underline-offset-4 hover:opacity-90"
                        >
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/45 backdrop-blur-[2px] text-white p-3 flex flex-col justify-between"
                          >
                            {doc && (
                              <div className="prose-invert prose-p:my-1 leading-relaxed lg:w-1/2">
                                {addClassToParagraphs(
                                  renderRichTextWithBreaks(doc),
                                  "page-title-xl",
                                  "h2"
                                )}
                              </div>
                            )}
                            <div>
                              <h6 className="text-base font-medium mb-2">
                                {title}
                              </h6>
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

      {/* Two circles (bottom-right, below the rail) */}
      <div className="mt-2 w-full flex justify-end">
        <div className="flex items-center gap-2 py-2">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={goPrev}
            disabled={atStart}
            className={`h-6 w-6 rounded-full border border-[var(--mesm-yellow)] bg-[var(--mesm-yellow)] ${
              atStart
                ? "opacity-40 cursor-default bg-transparent"
                : "bg-[var(--mesm-yellow)] hover:bg-transparent duration-200  cursor-pointer "
            }`}
          />
          <button
            type="button"
            aria-label="Scroll right"
            onClick={goNext}
            disabled={atEnd}
            className={`h-6 w-6 rounded-full border border-[var(--mesm-yellow)] bg-[var(--mesm-yellow)] ${
              atEnd
                ? "opacity-40 cursor-default bg-transparent"
                : "bg-[var(--mesm-yellow)] hover:bg-transparent duration-200 cursor-pointer"
            }`}
          />
        </div>
      </div>
    </section>
  );
}
