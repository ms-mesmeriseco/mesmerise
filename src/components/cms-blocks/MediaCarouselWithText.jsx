"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";

const TRANSITION_DURATION = 8000; // in milliseconds

export default function MediaCarouselWithText({ mediaContentCollection }) {
  const items = mediaContentCollection?.items || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef();

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, TRANSITION_DURATION);

    return () => clearTimeout(timeoutRef.current);
  }, [activeIndex, items.length]);

  if (items.length === 0) return null;

  const activeItem = items[activeIndex];

  return (
    <section className="wrapper w-full">
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-black">
        {/* Render image or video */}
        {activeItem.mediaContent?.contentType?.startsWith("image/") ? (
          <Image
            src={activeItem.mediaContent.url}
            alt={activeItem.labelText || "carousel image"}
            fill
            className="object-cover"
          />
        ) : (
          <video
            src={activeItem.mediaContent.url}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Top-right overlay text */}
        {activeItem.textContent?.json && (
          <div className="absolute top-1 left-1 text-white p-4 rounded-lg max-w-[40%] text-sm z-10">
            {documentToReactComponents(activeItem.textContent.json, {
              renderNode: {
                [BLOCKS.HEADING_3]: (_node, children) => (
                  <h3 className="text-lg font-semibold">{children}</h3>
                ),
                [BLOCKS.HEADING_4]: (_node, children) => (
                  <h4 className="text-base font-medium">{children}</h4>
                ),
              },
            })}
          </div>
        )}

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
          <div
            className="h-full bg-white transition-all"
            style={{
              width: "100%",
              animation: `carousel-progress ${TRANSITION_DURATION}ms linear infinite`,
            }}
          />
        </div>
      </div>

      {/* Labels row */}
      <div className="flex justify-between align-left mt-4 gap-distribute text-sm font-medium">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`transition-colors px-3 py-1 rounded-full ${
              idx === activeIndex
                ? "bg-[var(--mesm-l-grey)] text-black"
                : "bg-muted text-foreground hover:bg-foreground/10"
            }`}
          >
            {item.labelText || `Slide ${idx + 1}`}
          </button>
        ))}
      </div>

      {/* Progress bar animation */}
      <style jsx>{`
        @keyframes carousel-progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
