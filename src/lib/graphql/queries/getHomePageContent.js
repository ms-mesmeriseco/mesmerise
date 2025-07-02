import { gql } from "@apollo/client";
import { GET_PAGE_BLOCKS } from "../fragments/getPageBlocks";
import { HERO_BANNER_FRAGMENT } from "../fragments/componentHeroBanner";
import { SINGLE_COLUMN_BLOCK } from "../fragments/singleColumnBlock";
import { TWO_COLUMN_BLOCK } from "../fragments/twoColumnBlock";

export const GET_HOME_PAGE = gql`
  {
    homePageCollection(limit: 1) {
      items {
        __typename
        sys {
          id
        }
        pageTitle
        pageSlug
        metaText {
          json
        }
        pageBlocksCollection(limit: 10) {
          items {
            ... on ComponentHeroBanner {
              ...HeroDetails
            }
            ... on IconRow {
              ...IconRowFragment
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
                    ...ImageDetails
                  }
                 
                  ... on ListIcons {
                    listItemsCollection(limit: 4) {
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
                    ...ImageDetails
                  }
                  ... on Video {
                    ...VideoDetails
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
                    ...ImageDetails
                  }
                  ... on Video {
                    ...VideoDetails
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  fragment IconRowFragment on IconRow {
      columnNumber
      contentDirection
    iconItemsCollection (limit: 12) {
      items {
        ... on ListIconItem {
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
  }

  fragment HeroDetails on ComponentHeroBanner {
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
  }
`;
