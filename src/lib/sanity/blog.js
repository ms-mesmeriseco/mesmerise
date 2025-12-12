// lib/sanity/blog.ts
import { groq } from "next-sanity";

export const blogPostBySlugQuery = groq`
*[_type == "blogPostPage" && slug.current == $slug][0]{
  _id,
  _type,
  postTitle,
  "slug": slug.current,
  metaTitle,
  metaDescription[]{..., },
  postHeading,
  postDate,

  // Hero image
  "heroImage": {
    "url": heroImage.asset->url,
    "width": heroImage.asset->metadata.dimensions.width,
    "height": heroImage.asset->metadata.dimensions.height,
    "alt": coalesce(heroImage.alt, "")
  },

  // Author
  "blogAuthor": blogAuthor->{
    name,
    "authorAvatar": {
      "url": authorAvatar.asset->url
    },
    authorBio[]{...,}
  },

  // Blog content with dereferenced assets
  "blogContent": blogContent[]{
    ...,
    // block-level images
    _type == "image" => {
      ...,
      "asset": asset->{
        url,
        "dimensions": metadata.dimensions
      }
    },
    // block-level files
    _type == "file" => {
      ...,
      "asset": asset->{
        url
      }
    },
    // fix markDefs for inline images/files
    markDefs[]{
      ...,
      _type == "image" => {
        ...,
        "asset": asset->{
          url,
          "dimensions": metadata.dimensions
        }
      },
      _type == "file" => {
        ...,
        "asset": asset->{
          url
        }
      }
    }
  },

  // FAQ content with same treatment
  "faqContent": faqContent[]{
    ...,
    _type == "image" => {
      ...,
      "asset": asset->{
        url,
        "dimensions": metadata.dimensions
      }
    },
    _type == "file" => {
      ...,
      "asset": asset->{
        url
      }
    },
    markDefs[]{
      ...,
      _type == "image" => {
        ...,
        "asset": asset->{
          url,
          "dimensions": metadata.dimensions
        }
      },
      _type == "file" => {
        ...,
        "asset": asset->{
          url
        }
      }
    }
  }
}
`;

export const adjacentBlogPostsQuery = groq`
{
  "prev": *[_type == "blogPostPage" && defined(postDate) && postDate < $date]
    | order(postDate desc)[0]{
      "slug": slug.current,
      postHeading
    },

  "next": *[_type == "blogPostPage" && defined(postDate) && postDate > $date]
    | order(postDate asc)[0]{
      "slug": slug.current,
      postHeading
    },

  // You can refine this later (tags etc). For now: 3 latest others.
  "related": *[_type == "blogPostPage" && slug.current != $slug]
    | order(postDate desc)[0...3]{
      "slug": slug.current,
      postHeading
    }
}
`;

export const blogRailPostsQuery = groq`
*[_type == "blogPostPage" && contentfulArchived != true]
| order(postDate desc){
  _id,
  "slug": slug.current,
  postTitle,
  postDate,
  // Minimal hero image shape for the rail
  "heroImage": {
    "url": heroImage.asset->url,
    "alt": coalesce(heroImage.alt, postTitle)
  }
}
`;

export const blogScrollPostsQuery = groq`
*[_type == "blogPostPage" && contentfulArchived != true]
| order(postDate desc){
  _id,
  "slug": slug.current,
  postTitle,
  postDate,
  "heroImage": {
    "url": heroImage.asset->url,
    "alt": coalesce(heroImage.alt, postTitle)
  }
}
`;
