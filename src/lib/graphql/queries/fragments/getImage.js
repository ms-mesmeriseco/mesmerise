import { gql } from "@apollo/client";

export const GET_IMAGE =gql`
  fragment ImageDetails on Image {
    imageContent {
      url
      title
      description
      width
      height
      contentType
      fileName
    }
  }
`;