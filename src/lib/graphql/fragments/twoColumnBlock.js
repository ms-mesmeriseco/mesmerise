import { gql } from "@apollo/client";

export const TWO_COLUMN_BLOCK = gql`
  fragment TwoColumnBlockFragment on TwoColumnBlockBlank {
            column1Collection {
              items {
                ... on ContentTypeRichText {
                  content {
                    json
                  }
                }
                ... on Image {
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
                ... on Video {
                  videoContent {
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
            }
            column2Collection {
              items {
                ... on ContentTypeRichText {
                  content {
                    json
                  }
                }
                ... on Image {
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
                ... on Video {
                  videoContent {
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
            }
          }
`;
