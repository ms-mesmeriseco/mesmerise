import { gql } from "@apollo/client";

export const GET_LIST_SWITCH = gql`
  fragment SwitchListDetails on ListWithImageSwitch {
    entryTitle
    listItemsCollection(limit: 3) {
      items {
        ... on ListSwitchItem {
          entryTitle
          listMedia {
            url
            title
            description
            width
            height
            contentType
            fileName
          }
          textContent
        }
      }
    }
  }
`;
