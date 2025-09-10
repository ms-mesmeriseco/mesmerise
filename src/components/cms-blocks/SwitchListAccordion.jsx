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
          className="w-full h-full object-cover rounded-xl md:aspect-[9/16] aspect-[6/4]"
          autoPlay
          muted
          loop
          style={{
            width: "auto",
            maxHeight: "80vh",

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
        style={{ width: "auto", maxHeight: "80vh" }}
        className="w-full h-full object-cover rounded-xl md:aspect-[9/16] aspect-[6/4]"
        loading="lazy"
      />
    );
  }

  return (
    <InView>
      {/* Desktop/tablet layout */}
      <section className="wrapper hidden md:grid grid-cols-[1fr_auto] md:gap-8 gap-0 min-h-[80vh] items-center justify-center">
        {/* Left column: Accordion */}
        <div className="flex flex-col h-[80vh] justify-center gap-6">
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
                        transition: { duration: 0.02 },
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
        {/* Right column: Media */}
        <div className="flex flex-col gap-6 items-center justify-center">
          <AnimatePresence mode="wait">
            {items[activeIndex]?.listMedia?.url && (
              <motion.div
                key={items[activeIndex].listMedia.url}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.1 }}
                className=" md:aspect-[9/16] aspect-[6/4] h-[80vh] rounded-xl shadow overflow-hidden border-1 border-[var(--mesm-grey-dk)] transition duration-200 ease-in-out flex items-center justify-center"
              >
                {renderMedia(items[activeIndex].listMedia)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      {/* Mobile layout */}
      <section className="wrapper md:hidden flex flex-col min-h-[80vh] gap-8 items-center justify-center">
        {items.map((item, idx) => (
          <div key={item.entryTitle || idx} className="w-full">
            <div className="border-l-2 border-[var(--mesm-yellow)] px-4 h-auto ease-in-out">
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
                  <>
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
                  </>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {activeIndex === idx && (
                <>
                  <motion.div
                    key={item.listMedia?.url}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className=" h-[60vh] rounded-xl shadow overflow-hidden border-1 border-[var(--mesm-grey-dk)] mt-4 flex items-center justify-center"
                  >
                    {renderMedia(item.listMedia)}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>
    </InView>
  );
}
