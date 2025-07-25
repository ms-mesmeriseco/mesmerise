import { getClient } from "@/lib/apollo-client";
import { GET_LANDING_PAGE_BY_SLUG } from "@/lib/graphql/queries/getLandingPages";
import PageBase from "@/components/layout/PageBase";
import HeroBanner from "@/components/cms-blocks/HeroBanner";
import TrustBadges from "@/components/cms-blocks/TrustBadges";

export default async function LandingPage({ params }) {
  const { slug } = params;
  const { data } = await getClient().query({
    query: GET_LANDING_PAGE_BY_SLUG,
    variables: { slug },
  });

  const page = data.landingPageCollection.items[0];

  if (!page) return <p>Page not found</p>;

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
            heroMedia={heroBlock.heroMedia}
            pageHeader={heroBlock.pageHeader}
            pageSubtitle={heroBlock.pageSubtitle}
            pageHeaderLine2={heroBlock.pageHeaderLine2}
            mediaHeight={heroBlock.mediaHeight}
          />
        </div>
      )}
      {trustBadgesBlock && (
        <div className="col-span-12" key="trust-badges">
          <TrustBadges
            textContent={trustBadgesBlock.textContent}
            logos={trustBadgesBlock.logosCollection?.items || []}
            scroll={trustBadgesBlock.scroll}
          />
        </div>
      )}
      <PageBase blocks={blocks} />
    </>
  );
}
