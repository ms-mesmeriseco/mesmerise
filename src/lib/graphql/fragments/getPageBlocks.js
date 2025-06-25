import { gql } from '@apollo/client';

export const GET_PAGE_BLOCKS = gql`
  fragment PageBlocks on Entry {
    __typename
    sys {
      id
    }

    ... on ComponentHeroBanner {
      entryTitle
      heroText {
        json
      }
      heroMedia {
        url
        title
        description
        width
        height
        contentType
        fileName
      }
    }

  }
`;