import { gql } from "@apollo/client";

export const GET_MEDIA_CAROUSEL = gql`
  fragment MTFrag on MediaCarouselWithText {
    entryTitle
    mediaContentCollection(limit: 4) {
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
