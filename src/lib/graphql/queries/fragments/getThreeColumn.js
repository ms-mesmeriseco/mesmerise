import { gql } from "@apollo/client";

export const GET_THREE_COLUMN = gql`
  fragment ThreeColumn on ThreeColumnBlockBlank {
    textContentOne
    textContentTwo
    textContentThree
    mediaCollection(limit: 3) {
      items {
        height
        width
        url
      }
    }
  }
`;
