import { gql } from "@apollo/client";

// Only what the footer renders
export const FOOTER_POST = gql`
  fragment FooterPost on BlogPostPage {
    slug
    postTitle
  }
`;

// Match posts that have the tag ID(s) you pass in
// Use id_contains_all if a post must include ALL tags
// Use id_contains_some if ANY of the tags is enough
export const GET_FOOTER_BLOG_POSTS = gql`
  query GetFooterBlogPosts($limit: Int = 4, $tagIds: [String!]) {
    blogPostPageCollection(
      limit: $limit
      order: postDate_DESC
      where: { contentfulMetadata: { tags: { id_contains_some: $tagIds } } }
    ) {
      items {
        ...FooterPost
      }
    }
  }
  ${FOOTER_POST}
`;
