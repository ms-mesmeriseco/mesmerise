"use client";

import HeroBanner from "@/components/cms-blocks/HeroBanner";
import StaticTrustBadges from "@/components/layout/StaticTrustBadges";
import StaticTwoColumn from "@/components/layout/StaticTwoColumn";
import ServiceTags from "@/components/services/ServiceTags";
import HorizontalAccordion from "@/components/layout/HorizontalAccordion";

export default function ServicesPage({
  trustBadgeText,
  trustBadgeLogos,
  column1Content,
  column2Content,
  serviceTags,
  processSteps,
}) {
  return (
    <div className="flex flex-col gap-[var(--global-margin-lg)] p-[var(--global-margin-lg)]">
      <section className="h-[70vh] flex items-center justify-center bg-[var(--mesm-blue)] rounded-xl"></section>
      {/* Tags */}
      <ServiceTags items={serviceTags} />
      {/* Trust Badges */}
      {/* <StaticTrustBadges heading={trustBadgeText} logos={trustBadgeLogos} /> */}

      {/* Description Section */}
      <StaticTwoColumn
        label="ABOUT THIS SERVICE"
        column1={column1Content}
        column2={column2Content}
      />

      {/* Process Accordion */}
      <HorizontalAccordion steps={processSteps} />
    </div>
  );
}
