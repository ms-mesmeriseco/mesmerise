import { gql } from "@apollo/client";

export const GET_BLOG_POSTS = gql`
  query GetBlogPageBySlug($slug: String!, $preview: Boolean) {
    blogPostPageCollection(
      limit: 1
      where: { slug: $slug }
      preview: $preview
    ) {
      items {
        postTitle
        slug
        metaTitle
        metaDescription {
          json
        }
        postHeading
        blogAuthor {
          __typename
          ... on TeamMember {
            name
            authorAvatar {
              url
              height
              width
            }
            authorBio {
              json
            }
          }
        }
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
              hyperlink {
                sys {
                  id
                }
                __typename
                ... on BlogPostPage {
                  slug
                  postTitle
                }
                ... on LandingPage {
                  pageSlug
                  pageTitle
                }
                ... on ProjectPage {
                  slug
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
              hyperlink {
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
  query GetAllBlogPosts($preview: Boolean) {
    blogPostPageCollection(limit: 50, order: postDate_DESC, preview: $preview) {
      items {
        postTitle
        slug
        postDate
        heroImage {
          url
          title
          width
          height
          contentType
          fileName
        }
        contentfulMetadata {
          tags {
            id
            name
          }
        }
      }
    }
  }
`;
