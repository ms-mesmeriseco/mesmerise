import { gql } from "@apollo/client";
import { GET_VIDEO } from "./getVideo";
import { GET_IMAGE } from "./getImage";
import { GET_ACCORDION } from "./getAccordion";
import { GET_LIST_ICONS } from "./getListIcons";
import { GET_LIST_SWITCH } from "./getListSwitch";

export const GET_TWO_COLUMN = gql`
  fragment TwoColumn on TwoColumnBlockBlank {
    blockAlignment
    column1Collection(limit: 3) {
      items {
        ... on ContentTypeRichText {
          content {
            json
          }
        }
        ... on Image {
          ...ImageDetails
        }
        ... on Video {
          ...VideoDetails
        }
        ... on AccordionWidget {
          ...AccordionWidgetFragment
        }
        ... on ListIcons {
          listItemsCollection(limit: 12) {
            items {
              icon {
                url
                title
              }
              textContent {
                json
              }
            }
          }
        }
      }
    }
    column2Collection(limit: 3) {
      items {
        ... on ContentTypeRichText {
          content {
            json
          }
        }
        ... on Image {
          ...ImageDetails
        }
        ... on Video {
          ...VideoDetails
        }
        ... on AccordionWidget {
          ...AccordionWidgetFragment
        }
        ... on ListIcons {
          listItemsCollection(limit: 4) {
            items {
              icon {
                url
                title
              }
              textContent {
                json
              }
            }
          }
        }
      }
    }
  }

  ${GET_VIDEO}
  ${GET_IMAGE}
  ${GET_ACCORDION}
  ${GET_LIST_ICONS}
  ${GET_LIST_SWITCH}
`;
