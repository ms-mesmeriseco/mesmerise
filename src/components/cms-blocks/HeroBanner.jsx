"use client";

import { motion } from "framer-motion";
import PrimaryButton from "../ui/PrimaryButton";
import InView from "@/hooks/InView";

const characterAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.035 },
  }),
};

function AnimatedText({ text, gradient }) {
  const words = text.split(" ");

  return (
    <span
      className={
        gradient
          ? "bg-gradient-to-r from-[var(--mesm-red)] to-[var(--mesm-yellow)] bg-clip-text text-transparent"
          : ""
      }
      style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={characterAnimation}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {word}
          {i < words.length - 1 && "\u00A0"}
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

  return (
    <InView>
      <div
        className={`relative h-[50vh] overflow-hidden flex items-end justify-left `}
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

        <div className="relative z-10 text-[var(--foreground)] text-left lg:max-w-[80vw] md:max-w-full sm:w-full p-[var(--global-margin-lg)]">
          <h1>
            <AnimatedText text={pageHeader} gradient />
            <br />
            <AnimatedText text={pageHeaderLine2} />
          </h1>
          <br />
          <div className="text-md text-[var(--mesm-l-grey)]">
            {pageSubtitle}
          </div>
          <br />
          <PrimaryButton href="/connect" className="mt-4" size="large">
            Learn More
          </PrimaryButton>
        </div>

        <div className="absolute inset-0 bg-black/40 z-[5]" />
      </div>
    </InView>
  );
}
