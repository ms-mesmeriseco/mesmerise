import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InView from "@/hooks/InView";

export default function SwitchListAccordion({ items, title }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items || items.length === 0) return null;

  function renderMedia(media) {
    if (!media?.url) return null;

    const commonClass = "w-full h-auto max-w-full object-cover rounded-xl"; // fill 1/2 column nicely
    const commonStyle = { maxHeight: "80vh" };

    if (media.contentType?.startsWith("video")) {
      return (
        <video
          src={media.url}
          controls
          className={commonClass}
          style={{ ...commonStyle, pointerEvents: "none" }}
          autoPlay
          muted
          loop
          playsInline
          loading="lazy"
        />
      );
    }

    return (
      <img
        src={media.url}
        alt={media.title || ""}
        className={commonClass}
        style={commonStyle}
        loading="lazy"
      />
    );
  }

  return (
    <InView>
      {/* Desktop / tablet: strict 1/2 + 1/2 */}
      <div>
        {title && <h2 className="text-center">{title}</h2>}
        <section className="hidden md:grid md:grid-cols-2 md:gap-8 items-center justify-center">
          {/* Left (1/2): Accordion */}
          <div className="col-span-1 flex flex-col  justify-center gap-6">
            {items.map((item, idx) => (
              <AnimatePresence key={item.entryTitle || idx}>
                <motion.div
                  key={idx}
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
                        key={`${item.entryTitle}-content`}
                        initial={{ opacity: 0, height: "0px" }}
                        animate={{
                          opacity: 1,
                          height: "64px",
                          transition: { duration: 0.4 },
                        }}
                        exit={{
                          opacity: 0,
                          height: "0px",
                          transition: { duration: 0.02 },
                        }}
                        className="ease-in-out text-[var(--mesm-l-grey)] text-sm"
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
            <div className="relative w-full h-[80vh] max-w-full overflow-hidden rounded-xl shadow ">
              <AnimatePresence initial={false} mode="wait">
                {items[activeIndex]?.listMedia?.url &&
                  (() => {
                    const m = items[activeIndex].listMedia;
                    const isVideo = m.contentType?.startsWith("video");

                    return isVideo ? (
                      <motion.video
                        key={m.url}
                        src={m.url}
                        // important bits ↓
                        className="absolute inset-0 w-full h-full object-contain"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        // avoid flash: eager-ish load & no layout jank
                        preload="metadata"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        style={{ pointerEvents: "none" }}
                      />
                    ) : (
                      <motion.img
                        key={m.url}
                        src={m.url}
                        alt={m.title || ""}
                        className="absolute inset-0 w-full h-full object-contain"
                        // cross-fade only (no scale)
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        // avoid flash: load the visible image eagerly
                        loading="eager"
                        fetchpriority="high"
                        decoding="async"
                      />
                    );
                  })()}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>
      {/* Mobile: unchanged (stacked) */}
      <section className="md:hidden flex flex-col min-h-[80vh] gap-8 items-center justify-center mt-4">
        {items.map((item, idx) => (
          <div key={item.entryTitle || idx} className="w-full">
            <div className="border-l-2 border-[var(--mesm-yellow)] px-4 h-auto ease-in-out ">
              <button
                className={`w-full text-left py-4 cursor-pointer  ${
                  activeIndex === idx ? "font-bold" : "font-normal"
                }`}
                onClick={() => setActiveIndex(idx)}
              >
                {item.entryTitle}
              </button>

              <AnimatePresence>
                {activeIndex === idx && (
                  <motion.div
                    key={`${item.entryTitle}-mobile-content`}
                    initial={{ opacity: 0, height: "0px" }}
                    animate={{
                      opacity: 1,
                      height: "64px",
                      transition: { duration: 0.4 },
                    }}
                    exit={{
                      opacity: 0,
                      height: "0px",
                      transition: { duration: 0.005 },
                    }}
                    className="py-2 ease-in-out text-[var(--mesm-l-grey)] text-sm"
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

            <AnimatePresence>
              {activeIndex === idx && (
                <motion.div
                  key={item.listMedia?.url}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="h-[60vh] w-full shadow overflow-hidden flex items-center justify-center"
                >
                  {renderMedia(item.listMedia)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>
    </InView>
  );
}
