import { gql } from "@apollo/client";

export const GET_TRUST_BADGES = gql`
fragment TrustBadgesFragment on TrustBadges {
    textContent {
      json
    }
    scroll
    logosCollection(limit: 5) {
      items {
        url
        title
        description
        width
        height
        contentType
        fileName
      }
    }
  }
`;