"use client";

import { useMemo } from "react";
import StaggeredWords from "@/hooks/StaggeredWords";
import InView from "@/hooks/InView";
import Button from "../ui/Button";
import TrustBadges from "./TrustBadges";
import { BLOCKS } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import AvatarRow from "../ui/AvatarRow";

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
            "px-3 py-0.5 md:px-3.5 md:py-1",
            "rounded-xl border border-[var(--mesm-grey-dk)]",
            "text-md md:text-lg md:text-base font-medium",
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
  pageSubtitle,
  heroList, // { json }
  showCta = true,
  ctaLabel,
  ctaUrl = "/connect",
  logos,
  heroEmbed,
}) {
  const listItems = useMemo(
    () => getListItemsFromRichText(heroList?.json || {}),
    [heroList]
  );

  const customers = [
    {
      id: 1,
      src: "/assets/customers/Tony.png",
    },
    {
      id: 2,
      src: "/assets/customers/Mitch.png",
    },
    { id: 3, src: "/assets/customers/Misty.png" },
    {
      id: 4,
      src: "/assets/customers/Lani_love.png",
    },
    { id: 5, src: "/assets/customers/Kirpy.png" },
    { id: 6, src: "/assets/customers/Kez.png" },
    // {
    //   id: 7,
    //   src: "/assets/customers/Jay.png",
    // },
    // { id: 8, src: "/assets/customers/Bobsicins.png" },
  ];

  return (
    <InView>
      {/* Grid lets us reorder on mobile and pin badges to base on desktop */}
      <section
        className={[
          "wrapper relative overflow-hidden pt-4",
          "",
          // Mobile: single column; Desktop: 2 columns + bottom row for badges
          "grid grid-cols-1 md:grid-cols-5 md:grid-rows-[1fr_auto]",
          "md:gap-6 gap-12",
          "md:min-h-[80vh]", // full screen height on md+
        ].join(" ")}
      >
        {/* TEXT — mobile order 1; desktop row 1 col 1 */}
        <div
          className={[
            "md:order-none",
            "md:row-start-1 md:col-start-1 md:col-span-3 col-span-1",
            "flex flex-col justify-center text-left gap-5",
            "text-[var(--foreground)]",
            "",
          ].join(" ")}
        >
          <StaggeredWords
            as="h1"
            className="page-title-medium"
            text={`${pageHeader || ""}`}
          />
          <StaggeredWords as="p" className="w-[90%]" text={pageSubtitle} />

          <PillList items={listItems} className="justify-start" />

          <div className="flex flex-col ">
            {showCta && (
              <Button href={ctaUrl} extraClass="" variant="accent" size="large">
                {ctaLabel || "Learn more"}
              </Button>
            )}
          </div>
          <AvatarRow people={customers} />
        </div>

        {/* MEDIA — mobile order 3; desktop row 1 col 2 */}
        <div
          className={[
            "md:order-none",
            "md:row-start-1 md:col-start-4 md:col-span-2 col-span-1",
            "flex items-center justify-center md:max-h-[70vh]",
          ].join(" ")}
        >
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
            {heroEmbed?.json ? (
              <div className="absolute inset-0 min-h-full">
                {documentToReactComponents(heroEmbed.json, richRenderOptions)}
              </div>
            ) : (
              <MediaDisplay media={heroMedia} fill />
            )}
          </div>
        </div>
        {logos?.length ? (
          <div className="w-full md:col-span-5 col-span-1">
            <TrustBadges logos={logos} />
          </div>
        ) : null}
      </section>
    </InView>
  );
}
