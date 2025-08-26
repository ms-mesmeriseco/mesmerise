// lib/fetchLandingPage.js
import { GET_LANDING_PAGE_SHELL } from "./getLandingPageShell";
import {
  Q_HERO_BY_IDS,
  Q_ICONROW_BY_IDS,
  Q_TRUSTBADGES_BY_IDS,
  Q_SWITCH_BY_IDS,
  Q_PILLBLOCK_BY_IDS,
  Q_TWOCOL_BY_IDS,
  Q_SINGLECOL_BY_IDS,
  Q_THREECOL_BY_IDS,
  Q_SINGLESTUDY_BY_IDS,
  Q_MEDIACARO_BY_IDS,
} from "./fragments/perTypeQueries";

const queryByType = {
  ComponentHeroBanner: Q_HERO_BY_IDS,
  TrustBadges: Q_TRUSTBADGES_BY_IDS,
  IconRow: Q_ICONROW_BY_IDS,
  MediaCarouselWithText: Q_MEDIACARO_BY_IDS,
  SingleColumnBlockBlank: Q_SINGLECOL_BY_IDS,
  TwoColumnBlockBlank: Q_TWOCOL_BY_IDS,
  SingleCaseStudy: Q_SINGLESTUDY_BY_IDS,
  ThreeColumnBlockBlank: Q_THREECOL_BY_IDS,
  ListWithImageSwitch: Q_SWITCH_BY_IDS,
  PillBlock: Q_PILLBLOCK_BY_IDS,
};

export async function fetchLandingPage(client, slug) {
  const shell = await client.query({
    query: GET_LANDING_PAGE_SHELL,
    variables: { slug },
  });
  const page = shell?.data?.landingPageCollection?.items?.[0];
  const blocks = page?.pageBlocksCollection?.items || [];

  // group by type
  const idsByType = {};
  for (const b of blocks) {
    if (!b?.__typename || !b?.sys?.id) continue;
    (idsByType[b.__typename] ||= []).push(b.sys.id);
  }

  // fetch only needed types, always reading from data.results.items
  const lookups = {};
  await Promise.all(
    Object.entries(idsByType).map(async ([typename, ids]) => {
      const query = queryByType[typename];
      if (!query) return;
      const { data } = await client.query({
        query,
        variables: { ids },
        fetchPolicy: "cache-first",
      });
      const items = data?.results?.items || [];
      lookups[typename] = items.reduce(
        (m, it) => (it?.sys?.id ? ((m[it.sys.id] = it), m) : m),
        {}
      );
    })
  );

  // merge back in original order
  const hydrated = blocks.map((b) => lookups[b.__typename]?.[b.sys.id] || b);
  return {
    pageMeta: {
      id: page?.sys?.id,
      title: page?.pageTitle,
      slug: page?.pageSlug,
    },
    blocks: hydrated,
  };
}
