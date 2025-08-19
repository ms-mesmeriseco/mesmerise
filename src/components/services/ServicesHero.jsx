"use client";

import HeroBanner from "@/components/cms-blocks/HeroBanner";
import StaticTrustBadges from "@/components/layout/StaticTrustBadges";
import StaticTwoColumn from "@/components/layout/StaticTwoColumn";
import ServiceTags from "@/components/services/ServiceTags";
import HorizontalAccordion from "@/components/layout/HorizontalAccordion";

export default function ServicesHero({
  column1Content,
  column2Content,
  serviceTags,
  heroMedia,
}) {
  return (
    <div className="flex flex-col gap-[var(--global-margin-lg)]">
      <section className="h-[70vh] flex items-center justify-center rounded-xl">
        <img
          src={heroMedia}
          alt="Hero Media"
          className="w-full h-full object-cover rounded-lg"
        />
      </section>
      {/* Tags */}
      <ServiceTags items={serviceTags} />
      <StaticTwoColumn
        label="ABOUT THIS SERVICE"
        column1={column1Content}
        column2={column2Content}
      />
    </div>
  );
}
