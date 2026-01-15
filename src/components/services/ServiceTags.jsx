"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

/* palette for hover background */
const HOVER_COLORS = [
  "var(--mesm-red)",
  // "var(--mesm-yellow)",
  // "var(--mesm-blue)",
  // "var(--accent)",
  // "var(--accent2)",
];

function hashToIndex(str, mod) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % mod;
}

export default function ServiceTags({
  items = [],
  label = "Service Capabilities",
  large = true,
  clickable = true,
  highlight = false,
}) {
  const router = useRouter();
  const EXCLUDED_TAGS = ["Layout: Highlight Grid"];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09 } },
  };
  const item = { hidden: { opacity: 0 }, show: { opacity: 1 } };

  const BASE_COLOUR_CLASSES = [
    "font-normal whitespace-nowrap cursor-pointer transition duration-200",
    "bg-[var(--mesm-grey)]/10 text-[var(--foreground)]",
    "border-1 border-[var(--mesm-grey-dk)]",

    "hover:bg-[var(--hover-color)] hover:text-[var(--background)]",
  ].join(" ");
  const HIGHLIGHT_CLASS = [
    "font-normal whitespace-nowrap cursor-pointer transition duration-200",
    "bg-[var(--mesm-grey)] text-[var(--background)]",

    "hover:bg-[var(--hover-color)] hover:text-[var(--background)]",
  ].join(" ");

  const SIZE_CLASSES = large
    ? "md:rounded-2xl rounded-xl md:px-3 md:py-1 md:text-5xl px-3 py-[0.05rem] text-2xl"
    : "rounded-xl px-3 py-0 text-md";

  const gapSize = large ? "md:gap-2 gap-1" : "gap-1";

  const handleClick = (tag, e) => {
    e.stopPropagation();
    router.push(`/work?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <section data-marker={label} className="flex flex-col">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={`flex flex-wrap ${gapSize}`}
      >
        {items
          .filter((tag) => !EXCLUDED_TAGS.includes(tag))
          .map((tag, idx) => {
            const hoverColor =
              HOVER_COLORS[hashToIndex(tag, HOVER_COLORS.length)];
            return (
              <motion.button
                key={idx}
                variants={item}
                onClick={clickable ? (e) => handleClick(tag, e) : null}
                className={`${BASE_COLOUR_CLASSES} ${SIZE_CLASSES}`}
                type="button"
                style={{ "--hover-color": hoverColor }}
              >
                {tag}
              </motion.button>
            );
          })}
      </motion.div>
    </section>
  );
}
