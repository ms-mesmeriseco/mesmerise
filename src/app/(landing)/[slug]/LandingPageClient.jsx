// app/landing/[slug]/LandingPageClient.jsx
"use client";

import PageBase from "@/components/layout/PageBase";
import LeftHero from "@/components/cms-blocks/LeftHero";
import CenterHero from "@/components/cms-blocks/CenterHero";

export default function LandingPageClient({ page }) {
  const blocks = page?.pageBlocksCollection?.items || [];

  const align = String(page?.align || "").toLowerCase();
  const isLeft =
    align === "left" || align === "start" || align === "l" || align === "true";
  const isCenter =
    align === "center" ||
    align === "middle" ||
    align === "c" ||
    align === "" ||
    align === "false";

  const Hero = isLeft ? LeftHero : CenterHero;

  return (
    <>
      <Hero
        heroMedia={page.media}
        pageHeader={page.line1}
        pageHeaderLine2={page.line2}
        pageSubtitle={page.sub}
        heroList={page.heroList}
        showCta
        ctaUrl="/connect"
        logos={page.trustCollection?.items}
        heroEmbed={page.hE}
      />
      <PageBase blocks={blocks} />
    </>
  );
}
