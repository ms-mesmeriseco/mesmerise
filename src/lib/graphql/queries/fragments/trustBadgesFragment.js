import { gql } from "@apollo/client";

export const GET_TRUST_BADGES = gql`
  fragment TrustBadgesFragment on TrustBadges {
    logosCollection(limit: 8) {
      items {
        url
        width
        height
      }
    }
  }
`;
