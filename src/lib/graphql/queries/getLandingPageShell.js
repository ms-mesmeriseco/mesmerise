import { gql } from "@apollo/client";

export const GET_LANDING_PAGE_SHELL = gql`
  query GetLandingPageShell($slug: String!) {
    landingPageCollection(limit: 1, where: { pageSlug: $slug }) {
      items {
        sys {
          id
        }
        pageTitle
        pageSlug
        pageBlocksCollection(limit: 20) {
          items {
            __typename
            ... on Entry {
              sys {
                id
              }
            }
          }
        }
      }
    }
  }
`;
