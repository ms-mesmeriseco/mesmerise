"use client";

import ServicesHero from "@/components/services/ServicesHero.jsx";
import ProcessBubbles from "@/components/services/ProcessBubbles";
import PageTitleLarge from "@/components/layout/PageTitleLarge.jsx";
import PackagesRow from "@/components/services/PackagesRow.jsx";
import StaticTwoColumn from "@/components/layout/StaticTwoColumn.jsx";
import StaticSingleColumn from "@/components/layout/StaticSingleColumn.jsx";
import SecondaryButton from "@/components/ui/SecondaryButton.jsx";

import {
  heroMedia,
  trustBadgeText,
  trustBadgeLogos,
  column1Content,
  column2Content,
  serviceTags,
  processSteps,
} from "./content.jsx";

export default function WebsitePage() {
  return (
    <>
      <div className="p-[var(--global-margin-lg)] flex flex-col gap-6">
        <ServicesHero
          heroMedia={heroMedia}
          heroTitle="Website"
          trustBadgeText={trustBadgeText}
          trustBadgeLogos={trustBadgeLogos}
          serviceTags={serviceTags}
          // You can still pass processSteps here if your ServicesPage uses HorizontalAccordion.
          // We’re rendering ProcessBubbles below instead.
        />
        <StaticTwoColumn
          label="ABOUT THIS SERVICE"
          column1={[
            <p key="p" className="p2">
              Whether you’re a startup launching your first site or an
              enterprise ready to revitalise your digital presence, we build
              websites that align with your audience, strengthen your brand, and
              deliver results that matter.
              <br />
              <br />
              Our research-driven, systemic approach ensures your website
              resonates with your people, represents your business with
              integrity, and supports meaningful growth long after launch.
            </p>,
          ]}
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
        <PackagesRow />
        <br />
        <br />
        <StaticSingleColumn
          label="ABOUT THIS SERVICE"
          column={[
            <div key="heading" className="items-center flex flex-col gap-6">
              <h2 className="text-center page-title-large">
                What We Build Isn&apos;t Just a Website, It&apos;s a Growth
                Engine.
              </h2>
              <br />
              <SecondaryButton key="button" size="x-large" href="/connect">
                Learn more
              </SecondaryButton>
            </div>,
            ,
          ]}
        />
        <br />

        <br />
      </div>
    </>
  );
}
