import { gql } from '@apollo/client';

export const HERO_BANNER_FRAGMENT = gql`
  fragment HeroBannerFields on ComponentHeroBanner {
    entryTitle
    heroText {
      json
    }
    heroMedia {
      url
      title
      description
      width
      height
      contentType
      fileName
    }
    mediaHeight
  }
`;
