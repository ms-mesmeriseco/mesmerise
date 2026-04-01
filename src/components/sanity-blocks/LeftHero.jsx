"use client";

import { useMemo } from "react";
import StaggeredWords from "@/hooks/StaggeredWords";
import InView from "@/hooks/InView";
import Button from "../ui/Button";
import TrustBadges from "./TrustBadges";
import AvatarRow from "../ui/AvatarRow";
import {
  listFromHeroL,
  extractIframeFromBlocks,
} from "../sanity-blocks/heroUtils";

function PillList({ items = [], className = "" }) {
  if (!items.length) return null;

  return (
    <div
      role="list"
      className={["flex flex-col gap-1 md:gap-2 items-start", className].join(
        " ",
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
            "hover:border-[var(--mesm-blue)]/70 hover:bg-[var(--background)]/90 hover:translate-x-[1px]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/25",
            "duration-200",
            "backdrop-blur-[1px]",
          ].join(" ")}
        >
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
  const isVideo =
    media?.mimeType?.includes("video") ||
    media?.asset?._type === "sanity.fileAsset";

  const common = "w-full h-full object-contain rounded-md";

  return isVideo ? (
    <video src={media.url} autoPlay muted loop playsInline className={common} />
  ) : (
    <img
      src={media.url}
      alt={media.alt || media.title || ""}
      className={common}
    />
  );
}

export default function LeftHero({
  heroMedia, // {url, mimeType, ...} from GROQ
  pageHeader,
  pageSubtitle,
  heroL, // Sanity blocks or strings
  showCta = true,
  ctaLabel,
  ctaUrl = "/connect",
  logos,
  heroEmbed, // Sanity blocks array (hE)
  customContent,
}) {
  const listItems = useMemo(() => listFromHeroL(heroL), [heroL]);

  const iframeHtml = useMemo(
    () => extractIframeFromBlocks(heroEmbed),
    [heroEmbed],
  );

  const customers = [
    { id: 1, src: "/assets/customers/Tony.png" },
    { id: 2, src: "/assets/customers/Mitch.png" },
    { id: 3, src: "/assets/customers/Misty.png" },
    { id: 4, src: "/assets/customers/Lani_love.png" },
    { id: 5, src: "/assets/customers/Kirpy.png" },
    { id: 6, src: "/assets/customers/Kez.png" },
  ];

  return (
    <InView>
      <section
        className={[
          "hero-wrapper relative overflow-hidden pt-4",
          "grid grid-cols-1 md:grid-cols-4 md:grid-rows-[1fr_auto]",
          "md:gap-6 gap-12",
          "md:min-h-[90vh]",
        ].join(" ")}
      >
        {/* TEXT */}
        <div
          className={[
            "md:row-start-1 md:col-start-1 md:col-span-2 col-span-1",
            "flex flex-col justify-center text-left gap-4",
            "text-[var(--foreground)] w-[90%]",
          ].join(" ")}
        >
          <StaggeredWords
            as="h1"
            className="page-title-medium"
            text={`${pageHeader || ""}`}
          />
          <StaggeredWords as="p" text={pageSubtitle} />

          <PillList items={listItems} className="justify-start" />

          <div className="flex flex-col">
            {customContent
              ? customContent
              : showCta && (
                  <Button
                    href={ctaUrl}
                    extraClass=""
                    variant="accent"
                    size="large"
                  >
                    {ctaLabel || "Learn more"}
                  </Button>
                )}
          </div>

          <AvatarRow people={customers} />
        </div>

        {/* MEDIA */}
        <div
          className={[
            "md:row-start-1 md:col-start-3 md:col-span-2 col-span-1",
            "flex items-center justify-center md:max-h-[70vh]",
          ].join(" ")}
        >
          <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden">
            {iframeHtml ? (
              <div
                className="absolute inset-0 w-full h-full"
                dangerouslySetInnerHTML={{ __html: iframeHtml }}
              />
            ) : (
              <MediaDisplay media={heroMedia} fill />
            )}
          </div>
        </div>

        {/* TRUST BADGES */}
        {logos?.length ? (
          <div className="w-full md:col-span-5 col-span-1">
            <TrustBadges logos={logos} />
          </div>
        ) : null}
      </section>
    </InView>
  );
}
