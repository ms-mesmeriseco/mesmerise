// src/lib/graphql/queries/getProjectRail.js
import { gql } from "@apollo/client";

export const RAIL_CARD = gql`
  fragment RailCard on ProjectPage {
    slug
    projectTitle
    dataOne {
      json
    } # keep only if you render it in the overlay
    contentfulMetadata {
      tags {
        id
        name
      }
    }
    heroMedia {
      title
      url(
        transform: {
          width: 1200
          height: 1800
          resizeStrategy: FILL
          format: WEBP
          quality: 70
        }
      )
      width
      height
    }
  }
`;

// Filter on Contentful tag IDs. Use `id_contains_all` for “must include all of”
export const GET_PROJECT_RAIL_BY_TAG = gql`
  query GetProjectRailByTag($limit: Int = 12, $tagIds: [String!]) {
    projectPageCollection(
      limit: $limit
      order: sys_firstPublishedAt_DESC
      where: { contentfulMetadata: { tags: { id_contains_all: $tagIds } } }
    ) {
      items {
        ...RailCard
      }
    }
  }
  ${RAIL_CARD}
`;
