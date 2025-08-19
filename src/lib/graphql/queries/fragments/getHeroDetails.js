import { gql } from "@apollo/client";

export const GET_HERO_DETAILS = gql`
  fragment HeroDetails on ComponentHeroBanner {
    entryTitle
    pageHeader
    pageHeaderLine2
    pageSubtitle
    ctaUrl
    heroMedia {
      url
      width
      height
      contentType
    }
  }
`;
