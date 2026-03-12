"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InView from "@/hooks/InView";

function normalizeMedia(media) {
  if (!media) return null;

  // If Sanity GROQ returns a bare URL string
  if (typeof media === "string") {
    return { url: media, mimeType: null, alt: "" };
  }

  // If GROQ returns { url, mimeType, alt } or similar
  if (typeof media === "object") {
    return {
      url: media.url || "",
      mimeType: media.mimeType || media.contentType || null,
      alt: media.alt || media.title || "",
    };
  }

  return null;
}

function renderMedia(media) {
  const info = normalizeMedia(media);
  if (!info?.url) return null;

  const { url, mimeType, alt } = info;
  const isVideo =
    mimeType?.startsWith?.("video") || url.match(/\.(mp4|webm|ogg)$/i) !== null;

  const commonClass = "w-full h-auto max-w-full object-cover rounded-xl";
  const commonStyle = { maxHeight: "80vh" };

  if (isVideo) {
    return (
      <video
        src={url}
        className={commonClass}
        style={{ ...commonStyle, pointerEvents: "none" }}
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="metadata"
      />
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={commonClass}
      style={commonStyle}
      loading="lazy"
      decoding="async"
    />
  );
}

export default function SwitchListAccordion({ items, title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileRowRefs = useRef([]); // for snap-to-top on mobile

  if (!items || items.length === 0) return null;

  // --- MOBILE HELPERS ONLY ---
  function handleMobileClick(idx) {
    // toggle open/close
    setActiveIndex((prev) => (prev === idx ? null : idx));

    // snap only on mobile sizes
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
    ) {
      const el = mobileRowRefs.current[idx];
      if (!el) return;

      const HEADER_OFFSET = 88;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const y =
          rect.top +
          (window.pageYOffset || document.documentElement.scrollTop) -
          HEADER_OFFSET;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    }
  }

  return (
    <InView>
      {/* ===== Desktop / tablet ===== */}
      <section className="narrow-wrapper">
        {title && <h2 className="text-center">{title}</h2>}
        <div className="hidden md:grid md:grid-cols-2 md:gap-8 items-center justify-center">
          {/* Left (1/2): Accordion */}
          <div className="col-span-1 flex flex-col justify-center gap-6">
            {items.map((item, idx) => (
              <AnimatePresence key={item._id || item.entryTitle || idx}>
                <motion.div
                  layout
                  className="border-l-2 border-[var(--mesm-yellow)] px-4 h-auto ease-in-out"
                  initial={{ opacity: 0, y: 10, height: "auto" }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    height: "auto",
                    transition: { duration: 0.2 },
                  }}
                  exit={{ opacity: 0, y: -10, height: "64px" }}
                >
                  <button
                    className={`w-full text-left py-4 ${
                      activeIndex === idx ? "font-bold" : "font-normal"
                    }`}
                    onClick={() => setActiveIndex(idx)}
                  >
                    {item.entryTitle}
                  </button>

                  <AnimatePresence>
                    {activeIndex === idx && (
                      <motion.div
                        layout
                        key={`${item._id || item.entryTitle || idx}-content`}
                        initial={{ opacity: 0, height: "0px" }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          transition: { duration: 0.4 },
                        }}
                        exit={{
                          opacity: 0,
                          height: "0px",
                          transition: { duration: 0.02 },
                        }}
                        className="ease-in-out text-[var(--mesm-l-grey)]"
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.textContent || "",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            ))}
          </div>

          {/* Right (1/2): Media */}
          <div className="col-span-1 flex items-center justify-center">
            <div className="relative w-full min-h-[60vh] max-w-full overflow-hidden rounded-xl shadow">
              <AnimatePresence initial={false} mode="wait">
                {items[activeIndex] && (
                  <motion.div
                    key={
                      normalizeMedia(items[activeIndex].media)?.url ||
                      `media-${activeIndex}`
                    }
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    {renderMedia(items[activeIndex].media)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Mobile ===== */}
      <section className="md:hidden flex flex-col gap-6 items-stretch justify-center mt-4">
        {items.map((item, idx) => {
          const open = activeIndex === idx;
          const mediaInfo = normalizeMedia(item.media);

          return (
            <div
              key={item._id || item.entryTitle || idx}
              ref={(el) => (mobileRowRefs.current[idx] = el)}
              className="w-full"
            >
              <div className="border-l-2 border-[var(--mesm-yellow)] px-4 h-auto ease-in-out">
                <button
                  className={`w-full text-left py-4 cursor-pointer ${
                    open ? "font-bold" : "font-normal"
                  }`}
                  onClick={() => handleMobileClick(idx)}
                  aria-expanded={open}
                  aria-controls={`mobile-panel-${idx}`}
                >
                  {item.entryTitle}
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`mobile-panel-${idx}`}
                      key={`${item._id || item.entryTitle || idx}-mobile-content`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        transition: { duration: 0.35 },
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        transition: { duration: 0.15 },
                      }}
                      className="py-2 pr-2 text-[var(--mesm-l-grey)] overflow-hidden max-h-[50vh] overflow-y-auto"
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.textContent || "",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Media: in normal flow, with spacing; no overlap */}
              <AnimatePresence initial={false}>
                {open && mediaInfo?.url && (
                  <motion.div
                    key={mediaInfo.url}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3 h-[48vh] w-full overflow-hidden rounded-xl shadow flex items-center justify-center"
                  >
                    {renderMedia(mediaInfo)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </section>
    </InView>
  );
}
