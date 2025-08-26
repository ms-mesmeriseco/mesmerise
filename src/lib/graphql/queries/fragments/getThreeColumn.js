// fragments/getThreeColumn.ts
import { gql } from "@apollo/client";

export const GET_THREE_COLUMN = gql`
  fragment ThreeColumn on ThreeColumnBlockBlank {
    entryTitle
    column1Collection(limit: 1) {
      items {
        ... on ListSwitchItem {
          ...ListitemDetails
        }
      }
    }
    column2Collection(limit: 1) {
      items {
        ... on ListSwitchItem {
          ...ListitemDetails
        }
      }
    }
    column1Collection(limit: 3) {
      items {
        ... on ListSwitchItem {
          ...ListitemDetails
        }
      }
    }
  }

  fragment ListItemDetails on ListSwitchItem {
    entryTitle
    textContent
    listMedia {
      url
      width
      height
    }
  }
`;
