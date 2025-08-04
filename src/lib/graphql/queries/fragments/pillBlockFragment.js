import { gql } from "@apollo/client";

export const GET_PILL_BLOCK = gql`
  fragment PillBlockFragment on PillBlock {
    pillOne
    pillOneContent {
      json
    }
    pillTwo
    pillTwoContent {
      json
    }
    pillThree
    pillThreeContent {
      json
    }
    pillFour
    pillFourContent {
      json
    }
  }
`;
