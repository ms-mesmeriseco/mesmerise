import { gql } from "@apollo/client";

export const GET_PROJECT_DATA =gql`
fragment ProjectData on ProjectPage {

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
        dataOne {
          json
        }
        dataTwo {
          json
        }
        dataThree {
          json
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

}`;