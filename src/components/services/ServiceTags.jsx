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

// supports:
// - string: "Performance"
// - object: { title: "Performance", slug: "performance" }
const getTagTitle = (t) => (typeof t === "string" ? t : t?.title || "");
const getTagSlug = (t) => (typeof t === "string" ? t : t?.slug || "");

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
    "font-normal whitespace-nowrap cursor-pointer transition duration-200 text-sm py-1",
    "bg-[var(--mesm-grey-xd)] text-[var(--background)] border-1 text-[var(--foreground)]/80 border-[var(--foreground)]/60",
  ].join(" ");

  const SIZE_CLASSES = large
    ? "md:rounded-2xl rounded-xl md:px-3 md:py-1 md:text-5xl px-3 py-[0.05rem] text-2xl"
    : "rounded-xl px-3 py-0 text-md";

  const gapSize = large ? "md:gap-2 gap-1" : "gap-1";

  const handleClick = (tag, e) => {
    e.stopPropagation();

    // if you pass strings, we treat them as the query token
    // if you pass objects, prefer slug
    const slugOrToken = getTagSlug(tag);
    if (!slugOrToken) return;

    router.push(`/work?tag=${encodeURIComponent(slugOrToken)}`);
  };

  const buttonClass = `${highlight ? HIGHLIGHT_CLASS : BASE_COLOUR_CLASSES} ${SIZE_CLASSES}`;

  return (
    <section data-marker={label} className="flex flex-col">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={`flex flex-wrap ${gapSize}`}
      >
        {items
          .filter((t) => {
            const title = getTagTitle(t);
            return title && !EXCLUDED_TAGS.includes(title);
          })
          .map((t, idx) => {
            const title = getTagTitle(t);
            const hoverColor =
              HOVER_COLORS[hashToIndex(title, HOVER_COLORS.length)];

            return (
              <motion.button
                key={`${title}-${idx}`}
                variants={item}
                onClick={clickable ? (e) => handleClick(t, e) : undefined}
                className={buttonClass}
                type="button"
                style={{ "--hover-color": hoverColor }}
              >
                {title}
              </motion.button>
            );
          })}
      </motion.div>
    </section>
  );
}
