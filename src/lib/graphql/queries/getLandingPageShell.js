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
import { gql } from "@apollo/client";
import { getClient } from "@/lib/apollo-client";

export default async function fetchLandingPageShell(slug) {
  // 1. Shallow fetch
  const { data } = await getClient().query({
    query: gql`
      query GetLandingPageBlockTypes($slug: String!) {
        landingPageCollection(limit: 1, where: { pageSlug: $slug }) {
          items {
            pageTitle
            pageSlug
            pageBlocksCollection(limit: 20) {
              items {
                __typename
                ... on Entry {
                  sys {
                    id
                  }
                }
                ... on ComponentHeroBanner {
                  sys {
                    id
                  }
                }
                ... on IconRow {
                  sys {
                    id
                  }
                }
                ... on ListWithImageSwitch {
                  sys {
                    id
                  }
                }
                ... on MediaCarouselWithText {
                  sys {
                    id
                  }
                }
                ... on TrustBadges {
                  sys {
                    id
                  }
                }
                ... on PillBlock {
                  sys {
                    id
                  }
                }
                ... on TwoColumnBlockBlank {
                  sys {
                    id
                  }
                }
                ... on SingleColumnBlockBlank {
                  sys {
                    id
                  }
                }

                ... on SingleCaseStudy {
                  sys {
                    id
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { slug },
    fetchPolicy: "network-only",
  });

  const page = data.landingPageCollection.items[0];
  const blocks = page.pageBlocksCollection.items;

  // 2. Group IDs by type
  const idsByType = {};
  blocks.forEach((block) => {
    if (!block?.__typename || !block?.sys?.id) return;
    if (!idsByType[block.__typename]) idsByType[block.__typename] = [];
    idsByType[block.__typename].push(block.sys.id);
  });

  // 3. Map types to queries
  const queryByType = {
    ComponentHeroBanner: Q_HERO_BY_IDS,
    IconRow: Q_ICONROW_BY_IDS,
    TrustBadges: Q_TRUSTBADGES_BY_IDS,
    ListWithImageSwitch: Q_SWITCH_BY_IDS,
    PillBlock: Q_PILLBLOCK_BY_IDS,
    TwoColumnBlockBlank: Q_TWOCOL_BY_IDS,
    SingleColumnBlockBlank: Q_SINGLECOL_BY_IDS,
    ThreeColumnBlockBlank: Q_THREECOL_BY_IDS,
    SingleCaseStudy: Q_SINGLESTUDY_BY_IDS,
    MediaCarouselWithText: Q_MEDIACARO_BY_IDS,
  };

  // 4. Fetch per-type data
  const blockDataById = {};
  await Promise.all(
    Object.entries(idsByType).map(async ([typename, ids]) => {
      const query = queryByType[typename];
      if (!query) return;
      const { data } = await getClient().query({
        query,
        variables: { ids },
        fetchPolicy: "network-only",
      });
      data.results.items.forEach((item) => {
        blockDataById[item.sys.id] = item;
      });
    })
  );

  // 5. Merge back
  const hydratedBlocks = blocks.map((block) => {
    if (!block?.sys?.id) return block;
    return blockDataById[block.sys.id] || block;
  });

  // 6. Return the full page object with hydrated blocks
  return {
    ...page,
    pageBlocksCollection: {
      ...page.pageBlocksCollection,
      items: hydratedBlocks,
    },
  };
}
