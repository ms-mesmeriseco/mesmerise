"use client";

import { useMemo } from "react";
import StaggeredWords from "@/hooks/StaggeredWords";
import InView from "@/hooks/InView";
import Button from "../ui/Button";
import TrustBadges from "./TrustBadges";

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
          className="px-4 py-1 rounded-xl border border-[var(--mesm-grey-dk)] flex flex-row items-center gap-3 hover:border-[var(--foreground)] duration-200 backdrop-blur-[1px] text-xl leading-tight"
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
  return isVideo ? (
    <video
      src={media.url}
      autoPlay
      muted
      playsInline
      controls
      className="absolute inset-0 w-full h-full object-cover  border-1 border-[var(--mesm-grey)]"
    />
  ) : (
    <img
      src={media.url}
      alt={media.title || ""}
      className="absolute inset-0 w-full h-full object-cover border-1 border-[var(--mesm-grey)]"
    />
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
  logos,
}) {
  const listItems = useMemo(
    () => getListItemsFromRichText(heroList?.json || {}),
    [heroList]
  );

  return (
    <InView>
      <section className="relative w-screen min-h-screen overflow-x-hidden text-center">
        <div className="mx-[var(--global-margin-md)] flex flex-col items-center">
          {/* Top stack: text + badges take most of the viewport */}
          <div className="wrapper w-full flex flex-col items-center justify-between min-h-[85vh] py-24">
            <div className="w-full text-[var(--foreground)] sm:p-[var(--global-margin-lg)] md:p-[var(--global-margin-sm)] lg:p-[var(--global-margin-lg)] flex flex-col gap-2 min-h-[60vh] justify-center items-center">
              <StaggeredWords
                as="h1"
                className="page-title-medium"
                text={`${pageHeader || ""} ${pageHeaderLine2 || ""}`}
              />
              <br />
              <PillList items={listItems} />
              <br />
              <div className="flex flex-col gap-6 items-center">
                <StaggeredWords as="p" className="p2" text={pageSubtitle} />

                {showCta && (
                  <Button
                    href={ctaUrl}
                    extraClass="mt-4"
                    variant="accent2"
                    size="large"
                  >
                    Learn More
                  </Button>
                )}
              </div>
            </div>
            <br />
            {/* Media below: 16:9 and 3/4 width on desktop (full on mobile) */}
            <div className="w-full flex items-center justify-center pb-16">
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                <MediaDisplay media={heroMedia} />
              </div>
            </div>

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
