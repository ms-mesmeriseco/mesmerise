"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import InView from "@/hooks/InView";
import StaggeredWords from "@/hooks/StaggeredWords";

/* ----------- Animation for your heading words (unchanged) ----------- */
const characterAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.035 },
  }),
};

function AnimatedText({ text = " ", gradient }) {
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

/* ----------- Rich Text list helpers ----------- */
function textFromNode(node) {
  if (!node) return "";
  if (node.nodeType === "text") return node.value || "";
  const children = node.content || [];
  return children.map(textFromNode).join("");
}
function collectListItems(node, out) {
  if (!node) return;
  const { nodeType, content = [] } = node;
  if (nodeType === "unordered-list" || nodeType === "ordered-list") {
    content.forEach((li) => {
      if (li?.nodeType === "list-item") {
        const text = li.content
          ?.map((child) => {
            if (child?.nodeType === "paragraph")
              return textFromNode(child).trim();
            if (
              child?.nodeType === "unordered-list" ||
              child?.nodeType === "ordered-list"
            ) {
              const nested = [];
              collectListItems(child, nested);
              return nested.join(" • ");
            }
            return "";
          })
          .filter(Boolean)
          .join(" ")
          .trim();
        if (text) out.push(text);
      }
    });
  }
  content.forEach((c) => collectListItems(c, out));
}
function getListItemsFromRichText(doc) {
  if (!doc || typeof doc !== "object") return [];
  const items = [];
  collectListItems(doc, items);
  return items;
}

/* ------------------------- Component ------------------------- */
export default function HeroBanner({
  heroMedia,
  pageHeader,
  pageSubtitle,
  pageHeaderLine2,
  heroAlignment, // truthy = left/vertical, falsy = center/horizontal (stack)
  showCta = true,
  ctaUrl = "/connect",
  heroList, // { json }
}) {
  const isVideo = heroMedia?.contentType?.includes("video");
  const isLeft = !!heroAlignment;
  const listItems = useMemo(
    () => getListItemsFromRichText(heroList?.json),
    [heroList]
  );

  // Layout: left-aligned = two columns; center = stacked
  const containerClasses = isLeft
    ? [
        "wrapper pt-[var(--header-height)] relative w-screen",
        "mx-[var(--global-margin-md)]",
        "flex flex-col md:flex-row items-center md:items-stretch justify-between",
        "gap-[var(--global-margin-lg)]",
      ].join(" ")
    : [
        "wrapper pt-[var(--header-height)] relative w-screen",
        "mx-[var(--global-margin-md)]",
        "flex flex-col items-center justify-center",
        "gap-[var(--global-margin-lg)]",
        "text-center",
      ].join(" ");

  const textColClasses = isLeft
    ? [
        "flex-1 min-w-0",
        "flex flex-col items-start text-left",
        "text-[var(--foreground)]",
        "sm:p-[var(--global-margin-lg)] md:p-[var(--global-margin-sm)] lg:p-[var(--global-margin-lg)]",
      ].join(" ")
    : [
        "w-full max-w-4xl",
        "flex flex-col items-center text-center",
        "text-[var(--foreground)]",
        "sm:p-[var(--global-margin-lg)] md:p-[var(--global-margin-sm)] lg:p-[var(--global-margin-lg)]",
      ].join(" ");

  const mediaColClasses = isLeft
    ? [
        "flex-1 min-w-0 w-1/2",
        "flex items-center justify-center",
        "md:max-h-[30vh]",
      ].join(" ")
    : [
        "w-3/4 max-w-4xl aspect-[16/9]",
        "flex items-center justify-center",
        "md:max-h-[30vh]",
      ].join(" ");

  const listWrapClasses = isLeft
    ? "flex flex-col items-start gap-2 list-none opacity-80 text-left"
    : "flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-2 list-none opacity-80 text-center";

  const pillClasses =
    "px-4 py-1 rounded-2xl border border-[var(--mesm-grey-dk)] flex flex-row items-center gap-2 hover:border-[var(--foreground)] duration-200 backdrop-blur-[1px] text-md leading-tight";

  return (
    <InView>
      <div className={containerClasses}>
        {/* TEXT COLUMN */}
        <div className={textColClasses}>
          <StaggeredWords
            as="h1"
            text={(pageHeader || "") + " " + (pageHeaderLine2 || "")}
          />

          {!!listItems.length && (
            <div className={listWrapClasses} role="list">
              {listItems.map((item, i) => (
                <div
                  key={`hero-li-${i}`}
                  role="listitem"
                  className={pillClasses}
                >
                  <img
                    width={24}
                    height={24}
                    src="/icons/check_32dp_FFFFFF_FILL0_wght300_GRAD0_opsz40.png"
                    alt=""
                  />
                  {item}
                </div>
              ))}
            </div>
          )}

          <div
            className={isLeft ? "flex flex-col gap-4" : "flex flex-col gap-6"}
          >
            <StaggeredWords as="p" className="mt-6" text={pageSubtitle} />
            {showCta && (
              <Button
                href={ctaUrl}
                extraClass="mt-4"
                variant="primary"
                size="x-large"
              >
                Learn More
              </Button>
            )}
          </div>
        </div>

        {/* MEDIA COLUMN / SECTION */}
        {heroMedia?.url && (
          <div className={mediaColClasses}>
            {isVideo ? (
              <video
                src={heroMedia.url}
                autoPlay
                muted
                loop
                playsInline
                className={
                  isLeft ? "w-full object-cover rounded-lg" : "w-3/4 rounded-lg"
                }
              />
            ) : (
              <img
                src={heroMedia.url}
                alt={heroMedia.title || ""}
                className={
                  isLeft
                    ? "w-full object-cover rounded-lg"
                    : "w-full rounded-lg"
                }
              />
            )}
          </div>
        )}
      </div>
    </InView>
  );
}
