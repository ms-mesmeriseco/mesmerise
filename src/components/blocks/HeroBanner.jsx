"use client";

import PropTypes from "prop-types";
import renderRichTextWithBreaks from "@/lib/renderRichTextWithBreaks";

export default function HeroBanner({ heroMedia, heroText, mediaHeight }) {
  const isVideo = heroMedia?.contentType?.includes("video");
  const heightClass = mediaHeight ? "h-(--fh-m)" : "h-[50vh]";

  return (
    <div
      className={`relative ${heightClass} overflow-hidden rounded-(--radius-lrg) flex items-center justify-center`}
    >
      {heroMedia?.url &&
        (isVideo ? (
          <video
            src={heroMedia.url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={heroMedia.url}
            alt={heroMedia.title || ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ))}

      <div className="relative z-10 text-[var(--foreground)] text-center max-w-5xl px-4">
        {heroText?.json && renderRichTextWithBreaks(heroText.json)}
      </div>

      <div className="absolute inset-0 bg-black/40 z-[5]" />
    </div>
  );
}
