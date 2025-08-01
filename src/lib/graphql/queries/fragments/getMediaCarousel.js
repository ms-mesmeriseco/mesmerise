import { gql } from "@apollo/client";

export const GET_MEDIA_CAROUSEL = gql`
  fragment MediaCarouselWithTextFragment on MediaCarouselWithText {
    entryTitle
    mediaContentCollection(limit: 6) {
      items {
        labelText
        textContent {
          json
        }
        mediaContent {
          url
          width
          height
          contentType
        }
      }
    }
  }
`;
