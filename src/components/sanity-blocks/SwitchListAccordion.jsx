"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InView from "@/hooks/InView";

const EASE = [0.4, 0, 0.2, 1];
const HEADER_OFFSET = 88;

// Expand/collapse share the same timing so a closing item and an opening item
// cancel each other out and the overall block height stays steady.
const collapse = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.35, ease: EASE },
};

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

function renderMedia(info) {
  if (!info?.url) return null;

  const { url, mimeType, alt } = info;
  const isVideo =
    mimeType?.startsWith?.("video") || /\.(mp4|webm|ogg)$/i.test(url);

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

const itemKey = (item, idx) => item._id || item.entryTitle || idx;

export default function SwitchListAccordion({ items, title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileRowRefs = useRef([]);
  const mobileButtonRefs = useRef([]);

  if (!items || items.length === 0) return null;

  const media = items.map((item) => normalizeMedia(item.media));
  // Mobile can close every row; desktop always shows one.
  const desktopIndex = activeIndex ?? 0;
  const desktopMedia = media[desktopIndex];

  function handleMobileClick(idx) {
    const prev = activeIndex;
    setActiveIndex(prev === idx ? null : idx);

    const row = mobileRowRefs.current[idx];
    if (!row) return;

    // If an open row above is about to collapse, the clicked row will move up
    // by that amount — account for it so the scroll lands on the final spot.
    let shift = 0;
    if (prev !== null && prev < idx) {
      const prevRow = mobileRowRefs.current[prev];
      const prevButton = mobileButtonRefs.current[prev];
      if (prevRow && prevButton) {
        shift = prevRow.offsetHeight - prevButton.offsetHeight;
      }
    }

    const y =
      row.getBoundingClientRect().top + window.scrollY - shift - HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <InView>
      {/* ===== Desktop / tablet ===== */}
      <section className="narrow-wrapper">
        {title && <h2 className="text-center">{title}</h2>}
        <div className="hidden md:grid md:grid-cols-2 md:gap-8 items-center justify-center">
          {/* Left (1/2): Accordion */}
          <div className="col-span-1 flex flex-col justify-center gap-6">
            {items.map((item, idx) => {
              const open = desktopIndex === idx;

              return (
                <div
                  key={itemKey(item, idx)}
                  className="border-l-2 border-[var(--mesm-yellow)] px-4 h-auto"
                >
                  <button
                    className={`w-full text-left py-4 ${
                      open ? "font-bold" : "font-normal"
                    }`}
                    onClick={() => setActiveIndex(idx)}
                    aria-expanded={open}
                  >
                    {item.entryTitle}
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="content"
                        {...collapse}
                        className="overflow-hidden text-[var(--mesm-l-grey)]"
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
              );
            })}
          </div>

          {/* Right (1/2): Media — crossfades between items */}
          <div className="col-span-1 flex items-center justify-center">
            <div className="relative w-full min-h-[60vh] max-w-full overflow-hidden rounded-xl shadow">
              <AnimatePresence initial={false}>
                {desktopMedia?.url && (
                  <motion.div
                    key={desktopMedia.url}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {renderMedia(desktopMedia)}
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
          const mediaInfo = media[idx];

          return (
            <div
              key={itemKey(item, idx)}
              ref={(el) => (mobileRowRefs.current[idx] = el)}
              className="w-full"
            >
              <div className="border-l-2 border-[var(--mesm-yellow)] px-4 h-auto">
                <button
                  ref={(el) => (mobileButtonRefs.current[idx] = el)}
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
                      key="content"
                      id={`mobile-panel-${idx}`}
                      {...collapse}
                      className="overflow-hidden"
                    >
                      {/* Padding lives inside so the height tween has no jump */}
                      <div
                        className="py-2 pr-2 text-[var(--mesm-l-grey)] max-h-[50vh] overflow-y-auto"
                        dangerouslySetInnerHTML={{
                          __html: item.textContent || "",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Media: in normal flow, height-animated so content below glides */}
              <AnimatePresence initial={false}>
                {open && mediaInfo?.url && (
                  <motion.div
                    key="media"
                    {...collapse}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 h-[48vh] w-full overflow-hidden rounded-xl shadow flex items-center justify-center">
                      {renderMedia(mediaInfo)}
                    </div>
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
