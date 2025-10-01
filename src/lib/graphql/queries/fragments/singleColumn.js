import { gql } from "@apollo/client";
import { GET_VIDEO } from "./getVideo";
import { GET_IMAGE } from "./getImage";
import { GET_ACCORDION } from "./getAccordion";
import { GET_LIST_ICONS } from "./getListIcons";
import { GET_LIST_SWITCH } from "./getListSwitch";
import { GET_BUTTON } from "./getButton";

export const GET_SINGLE_COLUMN = gql`
  fragment SingleColumn on SingleColumnBlockBlank {
    align
    ctaLab
    contentCollection(limit: 4) {
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
          listItemsCollection(limit: 15) {
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
