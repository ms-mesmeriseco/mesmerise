"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import PageTitleMedium from "./PageTitleMedium";

export default function HorizontalScrollCarousel({
  images = [],
  link,
  height = 420,
  rounded = "rounded-xs",
  className = "",
  title = "",
  center,
}) {
  const scrollerRef = useRef(null);

  // Keyboard support on focus
  const onKeyDown = useCallback((e) => {
    if (!scrollerRef.current) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollerRef.current.scrollBy({
        left: itemWidth(scrollerRef) + 24,
        behavior: "smooth",
      });
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollerRef.current.scrollBy({
        left: -1 * (itemWidth(scrollerRef) + 24),
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const scrollByItems = (dir = 1) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({
      left: dir * (itemWidth(scrollerRef) + 24),
      behavior: "smooth",
    });
  };

  return (
    <div>
      {/* <PageTitleMedium text={title} center={center} /> */}
      <h6>{title}</h6>
      <br />

      <div className={`relative ${className}`} style={{ height }}>
        {/* <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-20" /> */}
        {/* Scroll container */}
        <ul
          ref={scrollerRef}
          tabIndex={0}
          className={`group relative flex gap-3 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth h-full px-2 md:px-4 ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-[var(--mesm-yellow)]`}
          style={{ scrollbarWidth: "none" }}
        >
          <style jsx>{`
            ul::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {images.map((img, i) => {
            const href = img.href || link || undefined;
            const content = (
              <motion.figure
                key={i}
                className={`relative shrink-0 snap-start overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
                style={{
                  width: Math.min(720, Math.max(280, height * 1.6)),
                  height,
                }}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.06,
                  ease: [0.2, 0.65, 0.3, 0.9],
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt || ""}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover select-none"
                />
                {/* Per-image caption */}
                {img.caption && (
                  <figcaption className="absolute left-3 bottom-3 z-10 bg-[var(--mesm-yellow)] text-[var(--background)] text-sm md:text-md px-4 py-2 rounded-lg">
                    {img.caption}
                  </figcaption>
                )}
              </motion.figure>
            );

            return (
              <span key={i} className="list-none">
                {href ? (
                  <a
                    href={href}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--mesm-yellow)] focus-visible:ring-offset-[var(--background)]"
                    aria-label={img.alt || `Image ${i + 1}`}
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </span>
            );
          })}
        </ul>

        {/* Controls */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 md:px-4 z-30 pointer-events-none"></div>
      </div>
    </div>
  );
}

function itemWidth(ref) {
  const el = ref.current;
  if (!el) return 320;
  const child = el.querySelector("figure");
  if (!child) return 320;
  return child.getBoundingClientRect().width || 320;
}

/**
 * Usage example
 *
 * <HorizontalScrollCarousel
 *   images={[
 *     { src: "/img/a.jpg", alt: "Project A", href: "/work/a", caption: "Project A caption" },
 *     { src: "/img/b.jpg", alt: "Project B", caption: "Project B caption" },
 *     { src: "/img/c.jpg", alt: "Project C", href: "/work/c", caption: "Project C caption" },
 *   ]}
 *   link="/work" // fallback link used if an image item lacks href
 *   height={460}
 *   rounded="rounded-2xl"
 * />
 */
