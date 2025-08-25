"use client";

import ServicesHero from "@/components/services/ServicesHero.jsx";
import ProcessBubbles from "@/components/services/ProcessBubbles";
import StaticTwoColumn from "@/components/layout/StaticTwoColumn.jsx";
import StaticSingleColumn from "@/components/layout/StaticSingleColumn.jsx";
import SecondaryButton from "@/components/ui/SecondaryButton.jsx";

export default function ServicePageBase({
  heroTitle,
  heroMedia,
  trustBadgeText,
  trustBadgeLogos,
  serviceTags,
  paraContent1,
  processSteps,
  paraContent2,
  customBlock,
}) {
  return (
    <>
      <div className="p-[var(--global-margin-lg)] flex flex-col gap-6">
        <ServicesHero
          heroMedia={heroMedia}
          heroTitle={heroTitle}
          trustBadgeText={trustBadgeText}
          trustBadgeLogos={trustBadgeLogos}
          serviceTags={serviceTags}
        />
        <StaticTwoColumn
          label="ABOUT THIS SERVICE"
          column1={[paraContent1]}
          column2={[""]}
        />
        <br />
        <div className="text-center">
          <h2 className="page-title-large">Process</h2>
        </div>

        {/* Full-width row of process bubbles */}
        <div className="w-full py-12">
          <ProcessBubbles items={processSteps} />
        </div>
        <div className="text-center">
          <h2 className="page-title-large">Packages</h2>
        </div>
        <div>{customBlock}</div>
        <br />
        <br />
        <StaticSingleColumn
          label="ABOUT THIS SERVICE"
          column={[paraContent2]}
        />
        <br />

        <br />
      </div>
    </>
  );
}
