import { gql } from "@apollo/client";

export const GET_HERO_DETAILS = gql`
  fragment HeroDetails on ComponentHeroBanner {
    pageHeader
    pageHeaderLine2
    pageSubtitle
    ctaUrl
    heroAlignment
    heroMedia {
      url
      width
      height
      contentType
    }
  }
`;
