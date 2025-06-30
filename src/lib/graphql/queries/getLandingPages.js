// import { gql } from '@apollo/client';
// import { GET_PAGE_BLOCKS } from '../fragments/getPageBlocks';

// export const GET_LANDING_PAGES = gql`
// query GetLandingPageBySlug($slug: String!) {
//     landingPageCollection(where: { pageSlug: $slug }, limit: 1) {
//       items {
//         pageTitle
//         pageSlug
//             heroImage {
//                 url
//                 title
//                 description
//                 width
//                 height
//                 contentType
//                 fileName
//             }
//             pageBlocksCollection {
//             items {
//                 ... on ComponentHeroBanner {
//                     entryTitle
//                     heroText {
//                         json
//                     }
//                     heroMedia {
//                         url
//                         title
//                         description
//                         width
//                         height
//                         contentType
//                         fileName
//                     }
//                     }
//             }
//             }
//         }
//         }
//     }
// `;