import { groq } from "next-sanity";

export const footerBlogPostsByTagQuery = groq`
*[
  _type == "blogPostPage"
  && contentfulArchived != true
  && defined(slug.current)
  && $tagSlug in serviceTags[]->slug.current
]
| order(postDate desc)[0...$limit]{
  _id,
  "slug": slug.current,
  postTitle
}
`;
