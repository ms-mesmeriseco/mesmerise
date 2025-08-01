import { gql } from "@apollo/client";

export const GET_ACCORDION =gql`
  fragment AccordionWidgetFragment on AccordionWidget {
    icon {
      url
      title
      description
      width
      height
      contentType
      fileName
    }
    accordionContentCollection(limit: 4) {
      items {
        ... on AccordionItem {
          entryTitle
          textContent {
            json
          }
        }
      }
    }
  }`;