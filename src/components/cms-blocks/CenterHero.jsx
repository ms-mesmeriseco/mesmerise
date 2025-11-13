"use client";

import { useMemo } from "react";
import StaggeredWords from "@/hooks/StaggeredWords";
import InView from "@/hooks/InView";
import Button from "../ui/Button";
import TrustBadges from "./TrustBadges";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import Image from "next/image";
import AvatarRow from "../ui/AvatarRow";

function decodeEntities(str = "") {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

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

/* ---------- tiny helpers ---------- */
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

function PillList({ items }) {
  if (!items?.length) return null;
  return (
    <div
      className="flex flex-col md:flex-row md:flex-wrap md:items-center items-start justify-start md:justify-center gap-2 list-none opacity-80 text-center"
      role="list"
    >
      {items.map((item, i) => (
        <div
          key={`li-${i}`}
          role="listitem"
          className={[
            "inline-flex items-center gap-2",
            "px-3 py-0.5 md:px-3.5 md:py-1",
            "rounded-xl border-1 border-[var(--mesm-grey-dk)]",
            "text-md md:text-lg md:text-base font-medium",
            "bg-[var(--mesm-grey-dk)]/20",
            "hover:border-[var(--mesm-blue)] hover:bg-[var(--mesm-blue)]/20 hover:bg-[var(--background)]/90 hover:translate-y-[-1px] ",
            "focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/25",
            "duration-200",
            "backdrop-blur-[1px]",
          ].join(" ")}
        >
          <Image
            width={24}
            height={24}
            src="/icons/check_32dp_FFFFFF_FILL0_wght300_GRAD0_opsz40.png"
            alt=""
          />
          {item}
        </div>
      ))}
    </div>
  );
}

function MediaDisplay({ media }) {
  if (!media?.url) return null;
  const isVideo = media?.contentType?.includes("video");
  return isVideo ? (
    <video
      src={media.url}
      autoPlay
      muted
      playsInline
      controls
      className="aspect-[16/9] absolute inset-0 w-full h-full object-cover  border-1 border-[var(--mesm-grey)]"
    />
  ) : (
    <img
      src={media.url}
      alt={media.title || ""}
      className="aspect-[16/9] absolute inset-0 w-full h-full object-cover border-1 border-[var(--mesm-grey)]"
    />
  );
}

/* ---------- CenterHero ---------- */
export default function CenterHero({
  heroMedia,
  heroEmbed,
  pageHeader,
  pageSubtitle,
  heroL, // { json }
  showCta = true,
  ctaLabel,
  ctaUrl = "/connect",
  logos,
}) {
  const listItems = useMemo(
    () => getListItemsFromRichText(heroL?.json || {}),
    [heroL]
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
      <section className="relative min-h-screen overflow-x-hidden text-center">
        <div className="flex flex-col items-center">
          {/* Top stack: text + badges take most of the viewport */}
          <div
            className="wrapper flex flex-col items-center justify-between min-h-[85vh]
           md:py-14 py-10 "
          >
            <div className="text-[var(--foreground)] flex flex-col md:gap-8 gap-4 min-h-[60vh] md:justify-center justify-start items-start md:items-center text-left md:text-center md:w-4/5">
              <StaggeredWords
                as="h1"
                className="page-title-medium"
                text={`${pageHeader || ""}`}
              />
              <StaggeredWords as="p" className="p2" text={pageSubtitle} />

              <div className="flex flex-col gap-2 md:items-center md:justify-center justify-start items-start">
                <PillList items={listItems} />
                {showCta && (
                  <Button
                    href={ctaUrl}
                    extraClass="md:mt-8 mt-4"
                    variant="accent"
                    size="large"
                  >
                    {ctaLabel || "Learn more"}
                  </Button>
                )}
              </div>
              <AvatarRow people={customers} />
            </div>
            <br />

            {heroEmbed?.json ? (
              <div className="w-full flex items-center justify-center pb-16">
                <div className="md:w-3/4 w-full rounded-xl overflow-hidden m-auto aspect-[16/9]">
                  <div className="absolute inset-0 relative w-full aspect-[16/9]">
                    {documentToReactComponents(
                      heroEmbed.json,
                      richRenderOptions
                    )}
                  </div>
                </div>
              </div>
            ) : heroMedia?.url ? (
              <div className="w-full flex items-center justify-center pb-16">
                <div className="w-full rounded-lg overflow-hidden">
                  <div className="absolute inset-0 relative w-full aspect-[16/9]">
                    <MediaDisplay media={heroMedia} />
                  </div>{" "}
                </div>
              </div>
            ) : null}

            {logos?.length ? (
              <div className="w-full">
                <TrustBadges logos={logos} />
              </div>
            ) : null}
          </div>

          {/* Trust badges (still in the top stack) */}
        </div>
      </section>
    </InView>
  );
}
