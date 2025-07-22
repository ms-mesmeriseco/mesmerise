import { gql } from "@apollo/client";

export const GET_PROJECT_PAGES = gql`
  {
    projectPageCollection {
      items {
        projectTitle
        slug
        projectScope {
          json
        }
        projectDate
        category
        heroMedia {
          url
          title
          width
          height
        }
        mediaGalleryCollection {
          items {
            url
          }
        }
        extendedDescription {
          json
        }
      }
    }
  }
`;
