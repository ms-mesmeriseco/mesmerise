import { gql } from "@apollo/client";
import { GET_PAGE_BLOCKS } from "../fragments/getPageBlocks";

// this query is the same as the homepagecontent query
// any changes to the schema need to be replicated there most likely

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
        pageBlocksCollection(limit: 15) {
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
              contentCollection(limit: 3) {
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
                  ... on AccordionWidget {
                    ...AccordionWidgetFragment
                  }
                  ... on ListIcons {
                    listItemsCollection(limit: 12) {
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
              column1Collection(limit: 3) {
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
                  ... on AccordionWidget {
                    ...AccordionWidgetFragment
                  }
                  ... on ListIcons {
                    listItemsCollection(limit: 12) {
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
              column2Collection(limit: 3) {
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
                  ... on AccordionWidget {
                    ...AccordionWidgetFragment
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
    logosCollection(limit: 5) {
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
    iconItemsCollection(limit: 12) {
      items {
        ... on ListIconItem {
          icon {
            url
            title
            description
            width
            height
            contentType
            fileName
          }
          textContent {
            json
          }
        }
      }
    }
  }

  fragment AccordionWidgetFragment on AccordionWidget {
      icon {
        url
          title
          description
          width
          height
          contentType
          fileName
      }
    accordionContentCollection(limit: 8) {
      items {
        ... on AccordionItem {
          entryTitle
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
