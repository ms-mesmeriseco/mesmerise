"use client";

import HeroBanner from "@/components/cms-blocks/HeroBanner";
import StaticTrustBadges from "@/components/layout/StaticTrustBadges";
import StaticTwoColumn from "@/components/layout/StaticTwoColumn";
import ServiceTags from "@/components/services/ServiceTags";
import HorizontalAccordion from "@/components/layout/HorizontalAccordion";

function isVideo(src) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

export default function ServicesHero({
  column1Content,
  column2Content,
  serviceTags,
  heroMedia,
}) {
  return (
    <div className="flex flex-col gap-[var(--global-margin-sm)]">
      <section className="h-[70vh] flex items-center justify-center">
        {isVideo(heroMedia) ? (
          <video
            src={heroMedia}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-sm"
          />
        ) : (
          <img
            src={heroMedia}
            alt="Hero Media"
            className="w-full h-full object-cover rounded-sm"
          />
        )}
      </section>
      {/* Tags */}
      <ServiceTags items={serviceTags} />
    </div>
  );
}