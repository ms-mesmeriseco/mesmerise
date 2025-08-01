import { gql } from "@apollo/client";

export const GET_VIDEO = gql`
  fragment VideoDetails on Video {
    videoContent {
      url
      title
      description
      width
      height
      contentType
      fileName
    }
  }`;