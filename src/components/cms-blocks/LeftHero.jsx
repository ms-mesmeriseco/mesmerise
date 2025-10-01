"use client";

import { useMemo } from "react";
import StaggeredWords from "@/hooks/StaggeredWords";
import InView from "@/hooks/InView";
import Button from "../ui/Button";
import TrustBadges from "./TrustBadges";
import { BLOCKS } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

/* --- helpers --- */
function decodeEntities(str = "") {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// optional: lightly sanitize to keep only the iframe tag (prevents stray HTML)
function extractIframe(html = "") {
  const match = html.match(/<iframe[^>]*>[\s\S]*?<\/iframe>/i);
  return match ? match[0] : "";
}

const richRenderOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => {
      const raw = (node.content || [])
        .map((c) => (c.nodeType === "text" ? c.value || "" : ""))
        .join("");

      const looksLikeIframe =
        raw.includes("<iframe") || raw.includes("&lt;iframe");

      if (!looksLikeIframe) return <p>{children}</p>;

      // 1) decode & 2) extract the iframe only
      const decoded = decodeEntities(raw);
      const iframe = extractIframe(decoded);
      if (!iframe) return <p>{children}</p>;

      // Make it responsive inside your aspect-[16/9] wrapper
      return (
        <div
          className="absolute inset-0 w-full h-full"
          // We assume this input is trusted (YouTube embed).
          // If you ever allow arbitrary user input, add stricter sanitization.
          dangerouslySetInnerHTML={{ __html: iframe }}
        />
      );
    },
  },
};

/* ---------- tiny helpers (shared) ---------- */
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
  const items = [];
  collectListItems(doc, items);
  return items;
}

function PillList({ items = [], className = "" }) {
  if (!items.length) return null;

  return (
    <div
      role="list"
      className={["flex flex-col gap-1 md:gap-2 items-start", className].join(
        " "
      )}
    >
      {items.map((item, i) => (
        <span
          key={`pill-${i}`}
          role="listitem"
          className={[
            "inline-flex items-center gap-2",
            "px-3 py-1.5 md:px-3.5 md:py-1.5",
            "rounded-xl border border-[var(--mesm-grey-dk)]",
            "text-sm md:text-base font-medium",
            "bg-[var(--mesm-grey-dk)]/20",
            "hover:border-[var(--mesm-blue)]/70 hover:bg-[var(--background)]/90 hover:translate-x-[1px] ",
            "focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/25",
            "duration-200",
            "backdrop-blur-[1px]",
          ].join(" ")}
        >
          {/* swap to inline SVG for smoother rendering & no layout shift */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
          <span className="whitespace-nowrap">{item}</span>
        </span>
      ))}
    </div>
  );
}

function MediaDisplay({ media, fill = false }) {
  if (!media?.url) return null;
  const isVideo = media?.contentType?.includes("video");
  const common = fill
    ? "w-full h-full object-cover rounded-lg border-1 border-[var(--mesm-grey)]"
    : "w-full h-full object-cover rounded-lg border-1 border-[var(--mesm-grey)]";
  return isVideo ? (
    <video src={media.url} autoPlay muted loop playsInline className={common} />
  ) : (
    <img src={media.url} alt={media.title || ""} className={common} />
  );
}

/* ---------- LeftHero ---------- */
export default function LeftHero({
  heroMedia,
  pageHeader,
  pageHeaderLine2,
  pageSubtitle,
  heroList, // { json }
  showCta = true,
  ctaUrl = "/connect",
  logos,
  heroEmbed,
}) {
  const listItems = useMemo(
    () => getListItemsFromRichText(heroList?.json || {}),
    [heroList]
  );

  return (
    <InView>
      {/* Grid lets us reorder on mobile and pin badges to base on desktop */}
      <section
        className={[
          "relative w-screen overflow-hidden py-12 max-w-[1120px] mx-auto",
          "mx-[var(--global-margin-md)]",
          // Mobile: single column; Desktop: 2 columns + bottom row for badges
          "grid grid-cols-1 md:grid-cols-2 md:grid-rows-[1fr_auto]",
          "gap-[var(--global-margin-xs)]",
          "md:min-h-screen", // full screen height on md+
        ].join(" ")}
      >
        {/* TEXT — mobile order 1; desktop row 1 col 1 */}
        <div
          className={[
            "md:order-none",
            "md:row-start-1 md:col-start-1",
            "flex flex-col justify-center text-left gap-4",
            "text-[var(--foreground)]",
            "p-[var(--global-margin-md)] md:p-[var(--global-margin-sm)] lg:p-[var(--global-margin-lg)]",
          ].join(" ")}
        >
          <StaggeredWords
            as="h1"
            className="page-title-medium"
            text={`${pageHeader || ""} ${pageHeaderLine2 || ""}`}
          />
          <StaggeredWords as="p" className="" text={pageSubtitle} />

          <PillList items={listItems} className="justify-start" />
          <div className="flex flex-col ">
            {showCta && (
              <Button
                href={ctaUrl}
                extraClass="mt-4"
                variant="accent"
                size="large"
              >
                Learn More
              </Button>
            )}
          </div>
        </div>

        {/* TRUST BADGES — mobile order 2; desktop bottom row spanning both cols */}

        {/* MEDIA — mobile order 3; desktop row 1 col 2 */}
        <div
          className={[
            "md:order-none",
            "md:row-start-1 md:col-start-2",
            "flex items-center justify-center md:max-h-[70vh]",
          ].join(" ")}
        >
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mx-6">
            {heroEmbed?.json ? (
              <div className="absolute inset-0">
                {documentToReactComponents(heroEmbed.json, richRenderOptions)}
              </div>
            ) : (
              <MediaDisplay media={heroMedia} fill />
            )}
          </div>
        </div>
        <div
          className={[
            "md:order-none",
            "md:row-start-2 md:col-span-2 md:self-end w-full py-2",
          ].join(" ")}
          key="trust-badges"
        >
          <TrustBadges logos={logos} />
        </div>
      </section>
    </InView>
  );
}
