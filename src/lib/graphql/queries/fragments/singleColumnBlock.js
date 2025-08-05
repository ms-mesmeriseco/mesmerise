// import { gql } from "@apollo/client";

// export const SINGLE_COLUMN_BLOCK = gql`
//   fragment SingleColumnBlockFragment on SingleColumnBlockBlank {
//             contentCollection {
//               items {
//                 ... on ContentTypeRichText {
//                   content {
//                     json
//                   }
//                 }
//                 ... on Image {
//                   imageContent {
//                     url
//                     title
//                     description
//                     width
//                     height
//                     contentType
//                     fileName
//                   }
//                 }
//                 ... on Video {
//                   videoContent {
//                     url
//                     title
//                     description
//                     width
//                     height
//                     contentType
//                     fileName
//                   }
//                 }
//                 ... on ListIcons {
//                     listItemsCollection(limit: 2) {
//                       items {
//                         icon {
//                           url
//                           title
//                         }
//                         textContent {
//                           json
//                         }
//                       }
//                     }
//                   }
//               }
//             }
//           }
// `;
