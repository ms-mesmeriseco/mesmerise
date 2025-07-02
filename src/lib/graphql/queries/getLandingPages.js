import { gql } from "@apollo/client";
import { GET_PAGE_BLOCKS } from "../fragments/getPageBlocks";

export const GET_LANDING_PAGE_BY_SLUG = gql`
  query GetLandingPageBySlug($slug: String!) {
    landingPageCollection(limit: 1, where: { pageSlug: $slug }) {
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
            ... on TrustBadges {
              ...TrustBadgesFragment
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

fragment TrustBadgesFragment on TrustBadges {
    textContent {
      json
    }
    scroll
    logosCollection {
      items {
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

  fragment IconRowFragment on IconRow {
      columnNumber
      contentDirection
    iconItemsCollection {
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

export const GET_ALL_LANDING_PAGES = gql`
  query GetAllLandingPages {
    landingPageCollection {
      items {
        pageTitle
        pageSlug
      }
    }
  }
`;
