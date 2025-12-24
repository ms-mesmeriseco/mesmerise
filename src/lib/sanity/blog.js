import { groq } from "next-sanity";

export const blogPostBySlugQuery = groq`
*[_type == "blogPostPage" && slug.current == $slug][0]{
  _id,
  _type,
  postTitle,
  "slug": slug.current,
  metaTitle,
  metaDescription[]{...,},
  postHeading,
  postDate,
  "serviceTags": tags[]->{
    _id,
    title,
    "slug": slug.current
  },
  "heroImage": {
    "url": heroImage.asset->url,
    "width": heroImage.asset->metadata.dimensions.width,
    "height": heroImage.asset->metadata.dimensions.height,
    "alt": coalesce(heroImage.alt, "")
  },

  "blogAuthor": blogAuthor->{
    name,
    "authorAvatar": { "url": authorAvatar.asset->url },
    authorBio[]{...,}
  },

  // --------------------------------------------------
  // Blog content (Portable Text)
  // --------------------------------------------------
  "blogContent": blogContent[]{
    ...,

    // ✅ If the block itself is a reference (embedded accordionItem)
    _type == "reference" => {
      "_key": _key,
      ...@->{
        _id,
        _type,

        // only expand when it's an accordionItem
        _type == "accordionItem" => {
          _id,
          _type,
          entryTitle1,
          entryTitle,
          textContent[]{
            ...,

            // inline annotations inside accordionItem text
            markDefs[]{
              ...,
              _type == "reference" => @->{
                _id,
                _type,
                entryTitle,
                "slug": slug.current
              },
              _type == "image" => { ..., "asset": asset->{ url, metadata } },
              _type == "file"  => { ..., "asset": asset->{ url } }
            }
          }
        }
      }
    },
// Embedded docs will come through as references
  _type == "reference" => {
    "_key": _key,
    ...@->{
      _id,
      _type,

    

      // -----------------------------
      // listIconItem (your schema)
      // -----------------------------
      _type == "listIconItem" => {
        _id,
        _type,
        entryTitle,
        "iconUrl": icon.asset->url,
        textContent[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => { href, target }
          }
        }
      }
    }
  },


    // ---------- BLOCK-LEVEL IMAGE ----------
    _type == "image" => {
      ...,
      "asset": asset->{
        url,
        "dimensions": metadata.dimensions
      }
    },

    // ---------- BLOCK-LEVEL FILE ----------
    _type == "file" => {
      ...,
      "file": asset->{
        url,
        "dimensions": metadata.dimensions
      }
    },

    // ---------- INLINE MARK DEFINITIONS (normal Portable Text marks) ----------
    markDefs[]{
      ...,

      // annotation: reference (your schema uses type: 'reference' in marks)
      _type == "reference" => @->{
        _id,
        _type,
        entryTitle,
        "slug": slug.current
      },

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

      _type == "video" => {
        ...,
        "asset": asset->{
          url
        }
      }
    }
  },

  // --------------------------------------------------
  // FAQ content (if this is also Portable Text)
  // --------------------------------------------------
  "faqContent": faqContent[]{
    ...,

    _type == "reference" => {
      "_key": _key,
      ...@->{
        _id,
        _type,

        _type == "accordionItem" => {
          _id,
          _type,
          entryTitle1,
          entryTitle,
          textContent[]{
            ...,
            markDefs[]{
              ...,
              _type == "reference" => @->{ _id, _type, entryTitle, "slug": slug.current },
              _type == "image" => { ..., "asset": asset->{ url, metadata } },
              _type == "file"  => { ..., "asset": asset->{ url } }
            }
          }
        }
      }
    },

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
      _type == "reference" => @->{ _id, _type, entryTitle, "slug": slug.current },
      _type == "image" => { ..., "asset": asset->{ url, "dimensions": metadata.dimensions } },
      _type == "file"  => { ..., "asset": asset->{ url } },
      _type == "video" => { ..., "asset": asset->{ url } }
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

  "heroImage": {
    "url": heroImage.asset->url,
    "alt": coalesce(heroImage.alt, postTitle)
  },

  "serviceTags": serviceTag[]->{
    _id,
    title,
    "slug": slug.current
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
  },
  "serviceTags": serviceTag[]->{
    _id,
    title,
    "slug": slug.current
  }
}
`;
