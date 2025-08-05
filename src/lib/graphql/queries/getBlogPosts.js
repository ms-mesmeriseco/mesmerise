import { gql } from "@apollo/client";

export const GET_BLOG_POSTS = gql`
  {
    blogPostPageCollection(limit: 10) {
      items {
        postTitle
        slug
        metaDescription {
          json
        }
        postHeading
        postAuthor
        postDate
        heroImage {
          url
          title
          description
          width
          height
          contentType
          fileName
        }
        blogContent {
          json
          links {
            entries {
              block {
                sys {
                  id
                }
                __typename
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
                ... on AccordionItem {
                  entryTitle
                  textContent {
                    json
                  }
                }
              }
            }
            assets {
              block {
                sys {
                  id
                }
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
    }
  }
`;
