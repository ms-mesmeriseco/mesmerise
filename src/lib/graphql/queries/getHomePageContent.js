import { gql } from '@apollo/client'
import { GET_PAGE_BLOCKS } from '../fragments/getPageBlocks'

export const GET_HOME_PAGE = gql`

    query GetHomePage {
  homePageCollection(limit: 1) {
    items {
      __typename
      sys { id }
      pageTitle
      pageSlug
      metaText {
        json
      }
      pageBlocksCollection (limit: 10) {
        items {
          ... on ComponentHeroBanner {
            entryTitle
            heroText {
              json
            }
            heroMedia {
              url
              title
              description
              width
              height
              contentType
              fileName
            }
            mediaHeight
          }

          ... on SingleColumnBlockBlank {
            contentCollection {
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
                ... on ListIcons {
                    listItemsCollection(limit: 2) {
                      items {
                        icon {
                          url
                          title
                        }
                        textContent {
                          json
                        }
                      }
                    }
                  }
              }
            }
          }

          ... on TwoColumnBlockBlank {
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
				 # <!-- closes pageBlocksCollection.items -->
        } 
       
           # <!-- closes pageBlocksCollection -->
      } 
   
       # <!-- closes homePageCollection.items -->
    } 
   
      # <!-- closes homePageCollection -->
  } 

}
`;