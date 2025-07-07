import { gql } from "@apollo/client";

export const GET_BLOG_POSTS = gql`
{
blogPostPageCollection {
    items {
      postTitle
      slug
      metaDescription {
        json
      }
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
      }
    }
  }  
}`;