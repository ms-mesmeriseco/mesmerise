import { gql } from "@apollo/client";

export const GET_VIDEO = gql`
  fragment VideoDetails on Video {
    videoContent {
      url
      width
      height
      contentType
    }
  }
`;
