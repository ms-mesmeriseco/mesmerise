import { gql } from "@apollo/client";

export const GET_LIST_ICONS = gql`
  fragment IconRowFragment on IconRow {
    entryTitle
    iconItemsCollection(limit: 12) {
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
  }`;