import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InView from "@/hooks/InView";

export default function SwitchListAccordion({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items || items.length === 0) return null;

  function renderMedia(media) {
    if (!media?.url) return null;
    if (media.contentType?.startsWith("video")) {
      return (
        <video
          src={media.url}
          controls
          className="w-full h-full object-cover rounded-xl"
          autoPlay
          muted
          loop
          style={{
            width: "auto",
            maxHeight: "70vh",
            aspectRatio: "9/16",
            pointerEvents: "none",
          }}
          loading="lazy"
        />
      );
    }
    return (
      <img
        src={media.url}
        alt={media.title || ""}
        style={{ width: "auto", maxHeight: "70vh", aspectRatio: "9/16" }}
        className="w-full h-full object-cover rounded-xl"
        loading="lazy"
      />
    );
  }
  return (
    <InView>
      <section className="wrapper grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[50vh] items-center justify-center">
        {/* Left column: Accordion */}
        <div className="flex flex-col h-[50vh] justify-center gap-6">
          {items.map((item, idx) => (
            <AnimatePresence key={item.entryTitle || idx}>
              <motion.div
                key={idx}
                className="border-l-2 border-[var(--mesm-yellow)] px-4 h-[auto] bg-white-300 ease-in-out"
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
                      key={item.entryTitle}
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
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
        {/* Right column: Image with aspect ratio */}
        <div className="flex flex-col gap-6 items-center justify-center">
          <AnimatePresence mode="wait">
            {items[activeIndex]?.listMedia?.url && (
              <motion.div
                key={items[activeIndex].listMedia.url}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.1 }}
                className="aspect-[4/6] max-h-[70vh] w-auto rounded-xl shadow overflow-hidden  transition duration-200 ease-in-out w-full flex items-center justify-center"
              >
                {renderMedia(items[activeIndex].listMedia)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </InView>
  );
}
