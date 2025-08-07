import { gql } from "@apollo/client";
import { GET_ACCORDION } from "./fragments/getAccordion.js";

export const GET_BLOG_POSTS = gql`
  query GetBlogPageBySlug($slug: String!) {
    blogPostPageCollection(limit: 1, where: { slug: $slug }) {
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
        faqContent {
          json
          links {
            entries {
              block {
                sys {
                  id
                }
                __typename
                ... on AccordionItem {
                  entryTitle
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
`;

export const GET_ALL_BLOG_POSTS = gql`
  query GetAllBlogPosts {
    blogPostPageCollection(limit: 15) {
      items {
        postTitle
        slug
      }
    }
  }
`;
