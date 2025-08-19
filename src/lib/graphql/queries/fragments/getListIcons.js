import { gql } from "@apollo/client";

export const GET_LIST_ICONS = gql`
  fragment IconRowFragment on IconRow {
    titleText {
      json
    }
    displayTwo
    iconItemsCollection(limit: 14) {
      items {
        ... on ListIconItem {
          icon {
            url
            title
            description
            width
            height
            contentType
            fileName
          }
          textContent {
            json
          }
        }
      }
    }
  }
`;
