// fragments/pillBlockWidget.ts
import { gql } from "@apollo/client";

export const PILL_BLOCK_WIDGET_FRAGMENT = gql`
  fragment PillBlockWidgetFragment on PillBlockWidget {
    entryTitle
    pillOneCollection(limit: 2) {
      items {
        __typename
        ... on ContentTypeRichText {
          content {
            json
          }
        }
        ... on Image {
          imageContent {
            url
            width
            height
          }
        }
      }
    }
  }
`;
