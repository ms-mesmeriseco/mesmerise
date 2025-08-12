// pillBlock.gql.js
import { gql } from "@apollo/client";

export const PILL_BLOCK_FRAGMENT = gql`
  fragment PillBlockFragment on PillBlock {
    pillOne
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
