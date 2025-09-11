"use client";

import { useEffect, useState, use } from "react";
import { getClient } from "@/lib/apollo-client";
import { GET_LANDING_PAGE_BY_SLUG } from "@/lib/graphql/queries/getLandingPages";
import PageBase from "@/components/layout/PageBase";
import LeftHero from "@/components/cms-blocks/LeftHero";
import CenterHero from "@/components/cms-blocks/CenterHero";
import TrustBadges from "@/components/cms-blocks/TrustBadges";

export default function LandingPage({ params }) {
  const { slug } = use(params);
  const [page, setPage] = useState(null);
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const { data } = await getClient().query({
          query: GET_LANDING_PAGE_BY_SLUG,
          variables: { slug },
        });
        setPage(data?.landingPageCollection?.items?.[0] || null);
      } catch (error) {
        console.error("Failed to fetch landing page:", error);
      }
    })();
  }, [slug]);

  if (!page) return <p>Loading...</p>;

  const blocks = page.pageBlocksCollection?.items || [];

  // Normalise align to a simple token
  const align = String(page.align || "").toLowerCase(); // e.g. "left" | "center" | "right"
  const isLeft =
    align === "left" || align === "start" || align === "l" || align === "true"; // supports old boolean-y values
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
      />

      <PageBase blocks={blocks} />
    </>
  );
}
