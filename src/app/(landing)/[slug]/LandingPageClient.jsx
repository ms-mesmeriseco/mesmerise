// app/landing/[slug]/LandingPageClient.jsx
"use client";

import PageBase from "@/components/layout/PageBase";
import LeftHero from "@/components/cms-blocks/LeftHero";
import CenterHero from "@/components/cms-blocks/CenterHero";
import LazyLandingBlocks from "./LazyLandingBlocks";

export default function LandingPageClient({ page }) {
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
        pageSubtitle={page.sub}
        heroL={page.heroL}
        showCta
        ctaUrl="/connect"
        logos={page.trustCollection?.items}
        heroEmbed={page.hE}
        ctaLabel={page.ctaLab}
      />

      {/* Below-the-fold content, fetched on scroll */}
      <LazyLandingBlocks slug={page.pageSlug} />
    </>
  );
}
