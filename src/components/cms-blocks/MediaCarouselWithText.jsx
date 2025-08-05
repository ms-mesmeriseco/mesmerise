"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { AnimatePresence, motion } from "framer-motion";

const TRANSITION_DURATION = 4200; // in ms

export default function MediaCarouselWithText({ mediaContentCollection }) {
  const items = mediaContentCollection?.items || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasRendered, setHasRendered] = useState(false);
  const [progressKey, setProgressKey] = useState(0); // force restart animation

  const timeoutRef = useRef();

  // Clear and restart on user toggle or new render
  useEffect(() => {
    if (!hasRendered) return;

    timeoutRef.current = setTimeout(() => {
      setHasRendered(false); // Wait for new media render
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, TRANSITION_DURATION);

    return () => clearTimeout(timeoutRef.current);
  }, [hasRendered, activeIndex, items.length]);

  if (items.length === 0) return null;

  const activeItem = items[activeIndex];

  const handleMediaLoad = () => {
    setHasRendered(true);
    setProgressKey(Date.now()); // Restart progress animation
  };

  return (
    <section className="wrapper w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          lazy="true"
          className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-black"
        >
          {/* Image or Video */}
          {activeItem.mediaContent?.contentType?.startsWith("image/") ? (
            <Image
              src={activeItem.mediaContent.url}
              alt={activeItem.labelText || "carousel image"}
              fill
              className="object-cover opacity-80"
              onLoad={handleMediaLoad}
            />
          ) : (
            <video
              src={activeItem.mediaContent.url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-80"
              onLoadedData={handleMediaLoad}
            />
          )}

          {/* Overlay text */}
          {activeItem.textContent?.json && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                lazy="true"
                className="absolute top-1 left-1 text-white p-4 rounded-lg max-w-[50%] text-sm z-10"
              >
                {documentToReactComponents(activeItem.textContent.json, {
                  renderNode: {
                    [BLOCKS.HEADING_3]: (_node, children) => (
                      <h3 className="text-lg font-bold">{children}</h3>
                    ),
                    [BLOCKS.HEADING_4]: (_node, children) => (
                      <h4 className="text-base font-medium">{children}</h4>
                    ),
                  },
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </AnimatePresence>
      {/* Labels grid */}
      <div
        className="grid mt-4 gap-2 font-medium"
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        <AnimatePresence mode="wait">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              className="relative flex flex-col items-start  mr-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              lazy="true"
            >
              <button
                onClick={() => {
                  setActiveIndex(idx);
                  setHasRendered(false);
                }}
                className={`text-left py-3 rounded-full transition-colors w-full ${
                  idx === activeIndex
                    ? "text-foreground"
                    : "hover:bg-foreground/10"
                }`}
              >
                {item.labelText || `Slide ${idx + 1}`}
              </button>

              {/* Progress bar under active button */}
              {idx === activeIndex && hasRendered && (
                <div className="absolute bottom-0 left-0 h-[0.1rem] bg-black w-full overflow-hidden">
                  <div
                    key={progressKey}
                    className="h-full bg-[var(--mesm-l-grey)] animate-progress"
                    style={{ animationDuration: `${TRANSITION_DURATION}ms` }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-progress {
          animation-name: progress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  );
}
