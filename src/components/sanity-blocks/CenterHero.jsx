"use client";

import { useMemo } from "react";
import StaggeredWords from "@/hooks/StaggeredWords";
import InView from "@/hooks/InView";
import Button from "../ui/Button";
import TrustBadges from "./TrustBadges";
import Image from "next/image";
import AvatarRow from "../ui/AvatarRow";
import GoogleBrow from "../ui/GoogleBrow";
import {
  listFromHeroL,
  extractIframeFromBlocks,
} from "../sanity-blocks/heroUtils";

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
            "text-md md:text-lg md:text-base ",
            "bg-[var(--mesm-grey-dk)]/20",
            "hover:border-[var(--mesm-blue)] hover:bg-[var(--mesm-blue)]/20 hover:bg-[var(--background)]/90 hover:translate-y-[-1px]",
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
  const isVideo =
    media?.mimeType?.includes("video") ||
    media?.asset?._type === "sanity.fileAsset";

  return isVideo ? (
    <video
      src={media.url}
      autoPlay
      muted
      playsInline
      controls
      className="aspect-[16/9] absolute inset-0 w-full h-full object-cover border-1 border-[var(--mesm-grey)]"
    />
  ) : (
    <img
      src={media.url}
      alt={media.alt || media.title || ""}
      className="aspect-[16/9] absolute inset-0 w-full h-full object-cover border-1 border-[var(--mesm-grey)]"
    />
  );
}

export default function CenterHero({
  heroMedia,
  heroEmbed, // Sanity blocks for iframe
  pageHeader,
  pageSubtitle,
  heroL, // Sanity blocks or strings
  showCta = true,
  ctaLabel,
  ctaUrl = "/connect",
  logos,
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
      <section className="relative min-h-[70vh] overflow-x-hidden text-center">
        <div className="flex flex-col items-center">
          <div className="wrapper flex flex-col items-center justify-between min-h-[85vh] md:py-14 py-10">
            <div className="text-[var(--foreground)] flex flex-col md:gap-8 gap-4 min-h-[60vh] md:justify-center justify-start items-start md:items-center text-left md:text-center md:w-4/5">
              <GoogleBrow />
              <StaggeredWords
                as="h1"
                className="page-title-medium"
                text={`${pageHeader || ""}`}
              />
              <StaggeredWords as="p" className="p2" text={pageSubtitle} />

              <div className="flex flex-col gap-8 md:items-center md:justify-center justify-start items-start">
                <PillList items={listItems} />
                {showCta && (
                  <Button
                    href={ctaUrl}
                    extraClass=""
                    variant="accent2"
                    size="large"
                  >
                    {ctaLabel || "Learn more"}
                  </Button>
                )}
              </div>

              <AvatarRow people={customers} />
            </div>

            <br />

            {iframeHtml ? (
              <div className="w-full flex items-center justify-center pb-16">
                <div className="md:w-3/4 w-full rounded-xl overflow-hidden m-auto aspect-[16/9]">
                  <div
                    className="absolute inset-0 relative w-full aspect-[16/9]"
                    dangerouslySetInnerHTML={{ __html: iframeHtml }}
                  />
                </div>
              </div>
            ) : heroMedia?.url ? (
              <div className="w-full flex items-center justify-center pb-16">
                <div className="w-full rounded-lg overflow-hidden">
                  <div className="absolute inset-0 relative w-full aspect-[16/9]">
                    <MediaDisplay media={heroMedia} />
                  </div>
                </div>
              </div>
            ) : null}

            {logos?.length ? (
              <div className="w-full">
                <TrustBadges logos={logos} />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </InView>
  );
}
