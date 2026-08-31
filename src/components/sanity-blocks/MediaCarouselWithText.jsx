"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { AnimatePresence, motion } from "framer-motion";
import InView from "@/hooks/InView";

const TRANSITION_DURATION = 4200; // in ms

export default function MediaCarouselWithText({
  mediaContentCollection,
  logoDisplay,
}) {
  // Supports:
  // - array directly: mediaContentCollection = block.mediaContent
  // - or collection shape: { items: [...] }
  const items = mediaContentCollection?.items || mediaContentCollection || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [hasRendered, setHasRendered] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const timeoutRef = useRef();

  useEffect(() => {
    if (!hasRendered || items.length === 0) return;

    timeoutRef.current = setTimeout(() => {
      setHasRendered(false);
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, TRANSITION_DURATION);

    return () => clearTimeout(timeoutRef.current);
  }, [hasRendered, activeIndex, items.length]);

  if (items.length === 0) return null;

  const activeItem = items[activeIndex];

  const mediaUrl =
    activeItem?.fileUrl ||
    activeItem?.mediaContent?.fileUrl || // fallback if you change projection later
    null;

  const isVideo = !!mediaUrl && /\.(mp4|mov|webm|ogg)$/i.test(mediaUrl);

  const handleMediaLoad = () => {
    setHasRendered(true);
    setProgressKey(Date.now());
  };

  if (!mediaUrl) {
    console.warn(
      "MediaCarouselWithText: missing media URL on item",
      activeItem,
    );
    return null;
  }

  const rawTextContent = activeItem?.textContent || [];

  const textBlocks = rawTextContent.map((block, idx) => ({
    ...block,
    _key: block._key ? `${block._key}-${idx}` : `pt-block-${idx}`,
  }));

  // logoDisplay is set on the carousel itself, not per item — when on, the
  // whole carousel switches to logos overlaid on the media with no progress bar.
  const useLogoDisplay = !!logoDisplay;

  return (
    <InView>
      <section className="narrow-wrapper w-full justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            lazy="true"
            className="relative w-full md:aspect-[16/9] aspect-[5/6] max-h-[70vh] overflow-hidden bg-black"
          >
            {/* Image or Video */}
            {isVideo ? (
              <video
                src={mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover hover:opacity-50 md:opacity-90 opacity-50 duration-500"
                onLoadedData={handleMediaLoad}
              />
            ) : (
              <Image
                src={mediaUrl}
                alt={activeItem.labelText || "carousel image"}
                fill
                className="object-cover hover:opacity-50 md:opacity-90 opacity-50 duration-500"
                onLoad={handleMediaLoad}
              />
            )}

            {rawTextContent.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeIndex}-text`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  lazy="true"
                  className="absolute top-1 left-1 text-[var(--foreground)] md:p-4 p-2 rounded-lg md:max-w-[50%] max-w-[100%] text-sm z-10"
                >
                  <PortableText
                    value={textBlocks}
                    components={{
                      block: {
                        h3: ({ children }) => (
                          <h3 className="text-lg font-bold">{children}</h3>
                        ),
                        h4: ({ children }) => (
                          <h4 className="text-base">{children}</h4>
                        ),
                        normal: ({ children }) => (
                          <p className="text-sm leading-relaxed">{children}</p>
                        ),
                      },
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            )}

            {/* --- Logo toggles, overlaid on the media --- */}
            {useLogoDisplay && (
              <div className="w-[100%] justify-around absolute bottom-0 left-0 w-full flex flex-row flex-0 gap-2 md:gap-4 p-3 md:p-5 z-10 bg-gradient-to-t from-black/70 to-transparent">
                {items.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  const showLogo = !!item.logoUrl;
                  return (
                    <button
                      key={`logo-toggle-${idx}`}
                      aria-label={item.labelText || `Slide ${idx + 1}`}
                      onClick={() => {
                        setActiveIndex(idx);
                        setHasRendered(false);
                      }}
                      className={`relative flex-1 inline-flex items-center justify-center h-10 md:h-12 px-3 md:px-4 transition-all duration-200  ${
                        isActive ? "opacity-100" : "opacity-30 hover:opacity-90"
                      }`}
                    >
                      {showLogo ? (
                        <Image
                          src={item.logoUrl}
                          alt={item.labelText || `Slide ${idx + 1}`}
                          width={80}
                          height={80}
                          className="md:h-24 w-24 object-contain pb-12"
                        />
                      ) : (
                        <span className="text-xs md:text-sm text-black">
                          {item.labelText || `Slide ${idx + 1}`}
                        </span>
                      )}

                      {isActive && hasRendered && (
                        <div className="absolute bottom-0 left-0 h-[0.15rem] bg-white/20 w-full overflow-hidden">
                          <div
                            key={progressKey}
                            className="h-full bg-[var(--mesm-yellow)] animate-progress"
                            style={{
                              animationDuration: `${TRANSITION_DURATION}ms`,
                            }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {!useLogoDisplay && (
          <>
            {/* --- Mobile dots --- */}
            <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
              {items.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={`dot-${idx}`}
                    aria-label={item.labelText || `Slide ${idx + 1}`}
                    onClick={() => {
                      setActiveIndex(idx);
                      setHasRendered(false);
                    }}
                    className={[
                      "relative inline-flex shrink-0 rounded-full transition-transform",
                      "w-5 h-5",
                      "bg-[var(--mesm-yellow)]",
                      isActive ? "" : "opacity-20 hover:opacity-100",
                    ].join(" ")}
                  />
                );
              })}
            </div>

            {/* --- Desktop labels --- */}
            <div
              className="hidden md:grid mt-4 gap-2"
              style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
            >
              <AnimatePresence>
                {items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="relative flex flex-col items-start mr-4"
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
                      className={`text-left text-sm cursor-pointer text-[var(--mesm-l-grey)] py-3 rounded-full transition-colors w-full ${
                        idx === activeIndex
                          ? "text-foreground"
                          : "hover:bg-foreground/10"
                      }`}
                    >
                      {item.labelText || `Slide ${idx + 1}`}
                    </button>

                    {idx === activeIndex && hasRendered && (
                      <div className="absolute bottom-0 left-0 h-[0.1rem] bg-black w-full overflow-hidden">
                        <div
                          key={progressKey}
                          className="h-full bg-[var(--mesm-yellow)] animate-progress"
                          style={{
                            animationDuration: `${TRANSITION_DURATION}ms`,
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

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
    </InView>
  );
}
