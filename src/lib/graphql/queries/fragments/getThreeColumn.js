// fragments/getThreeColumn.ts
import { gql } from "@apollo/client";

export const GET_THREE_COLUMN = gql`
  fragment ThreeColumn on ThreeColumnBlockBlank {
    entryTitle
    column1Collection(limit: 1) {
      items {
        ... on ListSwitchItem {
          entryTitle
          textContent
          listMedia {
            url
            width
            height
          }
        }
      }
    }
    column2Collection(limit: 1) {
      items {
        ... on ListSwitchItem {
          entryTitle
          textContent
          listMedia {
            url
            width
            height
          }
        }
      }
    }
    column3Collection(limit: 1) {
      items {
        ... on ListSwitchItem {
          entryTitle
          textContent
          listMedia {
            url
            width
            height
          }
        }
      }
    }
  }
`;
