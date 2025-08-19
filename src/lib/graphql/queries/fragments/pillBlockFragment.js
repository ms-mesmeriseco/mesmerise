// pillBlock.gql.js
import { gql } from "@apollo/client";

export const PILL_BLOCK_FRAGMENT = gql`
  fragment PillBlockFragment on PillBlock {
    pillOne
    blockTitle
    pillOneContent {
      json
    }
    pillOneMedia {
      url
    }
    pillTwo
    pillTwoContent {
      json
    }
    pillTwoMedia {
      url
    }
    pillThree
    pillThreeContent {
      json
    }
    pillThreeMedia {
      url
    }
    pillFour
    pillFourContent {
      json
    }
    pillFourMedia {
      url
    }
  }
`;
