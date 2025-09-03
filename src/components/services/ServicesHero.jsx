"use client";

import ServiceTags from "@/components/services/ServiceTags";
import PageTitleLarge from "../layout/PageTitleLarge";

function isVideo(src) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

export default function ServicesHero({ heroTitle, serviceTags, heroMedia }) {
  return (
    <div className="flex flex-col gap-[var(--global-margin-sm)]">
      <PageTitleLarge text={heroTitle} />

      {/* Tags */}
    </div>
  );
}
