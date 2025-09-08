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
    transition: { delay: i * 0.09 },
  }),
};

function AnimatedText({ text = " ", gradient }) {
  const safeText = typeof text === "string" ? text : "";
  const words = safeText.split(" ");
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

/* ----------- Utilities to extract list items from Rich Text JSON ----------- */
// Works with Contentful-like schema: unordered-list, ordered-list, list-item, paragraph, text
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
        // A list-item can contain paragraphs or nested lists.
        const text = li.content
          ?.map((child) => {
            if (child?.nodeType === "paragraph")
              return textFromNode(child).trim();
            // Handle nested lists inside list items (optional)
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

  // Traverse children to find lists anywhere in the tree
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
  heroAlignment, // truthy = left/vertical, falsy = center/horizontal grid
  showCta = true,
  ctaUrl = "/connect",
  heroList, // { json: <RichTextDocument> } expected
}) {
  const isVideo = heroMedia?.contentType?.includes("video");

  const alignmentClasses = heroAlignment
    ? "items-start text-left"
    : "items-center justify-center text-center";

  const listItems = useMemo(
    () => getListItemsFromRichText(heroList?.json),
    [heroList]
  );

  const isLeft = !!heroAlignment;

  return (
    <InView>
      <div className="relative h-[65vh] overflow-hidden flex items-center justify-left rounded-lg mx-[var(--global-margin-md)]">
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

        <div
          className={`wrapper relative z-10 text-[var(--foreground)] ${alignmentClasses} w-full sm:p-[var(--global-margin-lg)] md:p-[var(--global-margin-sm)] lg:p-[var(--global-margin-lg)]`}
        >
          <div className="sm:w-full">
            <span>
              <StaggeredWords
                as="h1"
                className="landing-title"
                text={pageHeader}
              />

              <StaggeredWords
                as="h1"
                className="landing-title"
                text={pageHeaderLine2}
              />
            </span>

            {pageSubtitle && (
              <>
                <br />
                <StaggeredWords
                  as="p"
                  className="p2 text-[var(--mesm-l-grey)] opacity-35"
                  text={pageSubtitle}
                />
              </>
            )}

            {/* ---------- Hero List ---------- */}
            {!!listItems.length && (
              <>
                <br />
                <div
                  className={[
                    // remove default bullets and spacing
                    "list-none opacity-80",
                    // left = vertical stack; center = grid with max 3 per row
                    isLeft
                      ? "flex flex-col items-start gap-2"
                      : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 justify-items-center",
                    // text alignment
                    isLeft ? "text-left" : "text-center",
                  ].join(" ")}
                  role="list"
                >
                  {listItems.map((item, i) => (
                    <div
                      key={`hero-li-${i}`}
                      role="listitem"
                      className={[
                        "px-3 py-1 rounded-full border",
                        "border-[var(--mesm-grey-dk)]/40 bg-black/20",
                        "backdrop-blur-[1px]",
                        "text-md leading-tight",
                        isLeft ? "w-auto" : "w-full max-w-[22rem]",
                      ].join(" ")}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </>
            )}

            {showCta && (
              <>
                <br />
                <Button
                  href={ctaUrl}
                  extraClass="mt-4"
                  variant="primary"
                  size="large"
                >
                  Learn More
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="absolute inset-0 bg-black/40 z-[5]" />
      </div>
    </InView>
  );
}
