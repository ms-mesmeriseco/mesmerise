"use client";

import { motion } from "framer-motion";
import PrimaryButton from "../ui/PrimaryButton";

const characterAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.02 },
  }),
};

function AnimatedText({ text, gradient }) {
  return (
    <span
      className={
        gradient
          ? "bg-gradient-to-r from-[var(--mesm-red)] to-[var(--mesm-yellow)] bg-clip-text text-transparent"
          : ""
      }
    >
      {[...text].map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={characterAnimation}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function HeroBanner({
  heroMedia,
  pageHeader,
  pageSubtitle,
  pageHeaderLine2,
  mediaHeight,
}) {
  const isVideo = heroMedia?.contentType?.includes("video");
  const heightClass = mediaHeight ? "min-h-(--fh-m)" : "min-h-[50vh]";

  return (
    <div
      className={`relative ${heightClass} overflow-hidden flex items-center justify-left `}
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

      <div className="relative z-10 text-[var(--foreground)] text-left max-w-[66vw] md:max-w-full p-[var(--global-margin-lg)]">
        <h1>
          <AnimatedText text={pageHeader} gradient />
          <br />
          <AnimatedText text={pageHeaderLine2} />
        </h1>
        <br />
        <p>{pageSubtitle}</p>
        <br />
        <PrimaryButton href="/connect" className="mt-4" size="large">
          Learn More
        </PrimaryButton>
      </div>

      <div className="absolute inset-0 bg-black/40 z-[5]" />
    </div>
  );
}
