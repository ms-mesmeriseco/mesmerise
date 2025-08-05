import { gql } from '@apollo/client';

export const GET_PAGE_BLOCKS = gql`
fragment PageBlocks on HomePagePageBlocksItem {
    __typename
    ... on ComponentHeroBanner {
      ...ComponentHeroBannerFragment
    }
    ... on SingleColumnBlockBlank {
      ...SingleColumnBlockFragment
    }
    ... on TwoColumnBlockBlank {
      ...TwoColumnBlockFragment
    }
  }

  fragment ComponentHeroBannerFragment on ComponentHeroBanner {
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

  fragment SingleColumnBlockFragment on SingleColumnBlockBlank {
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
        ... on Video {
          ...VideoDetails
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

  fragment TwoColumnBlockFragment on TwoColumnBlockBlank {
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
`;
