"use client";

import { useMemo } from "react";
import StaggeredWords from "@/hooks/StaggeredWords";
import InView from "@/hooks/InView";
import Button from "../ui/Button";

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
      className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-2 list-none opacity-80 text-center"
      role="list"
    >
      {items.map((item, i) => (
        <div
          key={`li-${i}`}
          role="listitem"
          className="px-4 py-1 rounded-2xl border border-[var(--mesm-grey-dk)] flex flex-row items-center gap-2 hover:border-[var(--foreground)] duration-200 backdrop-blur-[1px] text-md leading-tight"
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
  );
}

function MediaDisplay({ media }) {
  if (!media?.url) return null;
  const isVideo = media?.contentType?.includes("video");
  const common = "w-full h-auto rounded-2xl";
  return isVideo ? (
    <video src={media.url} autoPlay muted loop playsInline className={common} />
  ) : (
    <img src={media.url} alt={media.title || ""} className={common} />
  );
}

/* ---------- CenterHero ---------- */
export default function CenterHero({
  heroMedia,
  pageHeader,
  pageHeaderLine2,
  pageSubtitle,
  heroList, // { json }
  showCta = true,
  ctaUrl = "/connect",
}) {
  const listItems = useMemo(
    () => getListItemsFromRichText(heroList?.json || {}),
    [heroList]
  );

  return (
    <InView>
      <section
        className={[
          "wrapper relative w-screen overflow-hidden",
          "mx-[var(--global-margin-md)]",
          "flex flex-col items-center justify-center",
          "gap-[var(--global-margin-lg)]",
          "text-center",
        ].join(" ")}
      >
        {/* Text block */}
        <div
          className={[
            "w-full max-w-4xl",
            "flex flex-col items-center text-center",
            "text-[var(--foreground)]",
            "sm:p-[var(--global-margin-lg)] md:p-[var(--global-margin-sm)] lg:p-[var(--global-margin-lg)]",
          ].join(" ")}
        >
          <StaggeredWords
            as="h1"
            text={`${pageHeader || ""} ${pageHeaderLine2 || ""}`}
          />
          <PillList items={listItems} />
          <div className="flex flex-col gap-6 items-center">
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

        {/* Media below */}
        <div className="w-full max-w-4xl flex items-center justify-center md:max-h-[70vh]">
          <MediaDisplay media={heroMedia} />
        </div>
      </section>
    </InView>
  );
}
