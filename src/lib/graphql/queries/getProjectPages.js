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
        collaborationModel
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
        contentfulMetadata {
          tags {
            id
            name
          }
        }
      }
    }
  }
`;
