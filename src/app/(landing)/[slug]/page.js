"use client";

import { useEffect, useState, use } from "react";
import { getClient } from "@/lib/apollo-client";
import { GET_LANDING_PAGE_BY_SLUG } from "@/lib/graphql/queries/getLandingPages";
import PageBase from "@/components/layout/PageBase";
import HeroBanner from "@/components/cms-blocks/HeroBanner";
import TrustBadges from "@/components/cms-blocks/TrustBadges";

export default function LandingPage({ params }) {
  const { slug } = use(params);
  const [page, setPage] = useState(null);

  useEffect(() => {
    async function fetchLandingPage() {
      try {
        const { data } = await getClient().query({
          query: GET_LANDING_PAGE_BY_SLUG,
          variables: { slug },
        });
        setPage(data.landingPageCollection.items[0]);
      } catch (error) {
        console.error("Failed to fetch landing page:", error);
      }
    }
    fetchLandingPage();
  }, [slug]);

  if (!page) return <p>Loading...</p>;

  const blocks = page.pageBlocksCollection.items;

  // Find the HeroBanner block
  const heroBlock = blocks.find(
    (block) => block.__typename === "ComponentHeroBanner"
  );

  // Find the TrustBadges block
  const trustBadgesBlock = blocks.find(
    (block) => block.__typename === "TrustBadges"
  );

  return (
    <>
      {heroBlock && (
        <div className="col-span-12 mb-[2rem]" key="hero-banner">
          <HeroBanner
            heroMedia={page.media}
            pageHeader={page.line1}
            pageSubtitle={page.sub}
            pageHeaderLine2={page.line2}
            heroAlignment={page.align}
          />
        </div>
      )}
      {trustBadgesBlock && (
        <div className="col-span-12" key="trust-badges">
          <TrustBadges
            logos={trustBadgesBlock.logosCollection?.items || []}
            scroll={trustBadgesBlock.scroll}
          />
        </div>
      )}
      <PageBase blocks={blocks} />
    </>
  );
}
