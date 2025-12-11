// lib/queries/landing.ts
import { groq } from "next-sanity";

export const landingBySlugQuery = groq`
*[_type == "landingPage" && pageSlug.current == $slug][0]{
  _id,
  _type,
  entryTitle,
  pageTitle,
  "slug": pageSlug.current,

  // SEO
  mT,
  metaDesc,

  // Hero
  hE,
  align,
  line1,
  sub,
  heroL,
  ctaLab,

  // Hero media as a simple {url, mimeType}
  "media": {
    "url": media.asset->url,
    "mimeType": media.asset->mimeType
  },

  // Trust images simplified
  "trust": trust[]{
    _key,
    "url": asset->url
  },

  // Page blocks
  pageBlocks[]->{
    _id,
    _type,
    entryTitle,

    // ---------- SINGLE COLUMN BLOCK ----------
    // Fields only relevant if _type == "singleColumnBlockBlank"
    align,
    ctaLab,
    "content": content[]->{
      _id,
      _type,
      entryTitle,

      // Rich text block
      content,

      // Image component
      "image": imageContent.asset->{
        url,
        "dimensions": metadata.dimensions
      },

      // Video component
      "videoFile": videoContent.asset->url,

      // List icons component
      listItems[]->{
        _id,
        _type,
        entryTitle,
        "icon": icon.asset->url,
        textContent
      },

// inside "content": content[]-> { ... } for single column
"icon": icon.asset->url,
"accordionItems": accordionContent[]->{
  _id,
  _type,
  entryTitle,
  textContent
}
    },
// ---------- TWO COLUMN BLOCK ----------
h2,
ctaCol,
ctaLab,

"column1": column1[]->{
  _id,
  _type,
  entryTitle,

  // Rich text block
  content,

  // Image component
  "image": imageContent.asset->{
    url,
    "dimensions": metadata.dimensions
  },

  // Video component
  "videoFile": videoContent.asset->url,

  // List icons component
  listItems[]->{
    _id,
    _type,
    entryTitle,
    "icon": icon.asset->url,
    textContent
  },

  // Accordion widget (when a column item is an accordionWidget)
  "icon": icon.asset->url,
  "accordionItems": accordionContent[]->{
    _id,
    _type,
    entryTitle,
    textContent
  }
},

"column2": column2[]->{
  _id,
  _type,
  entryTitle,
  content,
  "image": imageContent.asset->{
    url,
    "dimensions": metadata.dimensions
  },
  "videoFile": videoContent.asset->url,
  listItems[]->{
    _id,
    _type,
    entryTitle,
    "icon": icon.asset->url,
    textContent
  },
  "icon": icon.asset->url,
  "accordionItems": accordionContent[]->{
    _id,
    _type,
    entryTitle,
    textContent
  }
},
    // ---------- ICON ROW ----------
    titleText,
    displayTwo,
    iconItems[]->{
      _id,
      _type,
      entryTitle,
      // listIconItem
      "icon": select(
        defined(icon.asset) => icon.asset->url,
        null
      ),
      textContent,
      // listSwitchItem
      "media": select(
        defined(listMedia.asset) => listMedia.asset->url,
        null
      )
    },

    // ---------- LIST WITH IMAGE SWITCH ----------
    title,
    listItems[]->{
      _id,
      _type,
      entryTitle,
      textContent,
      "media": listMedia.asset->url
    },

    // ---------- PILL BLOCK ----------
    blockTitle,
    pillOne,
    pillOneContent,
    "pillOneMedia": pillOneMedia.asset->url,
    pillTwo,
    pillTwoContent,
    "pillTwoMedia": pillTwoMedia.asset->url,
    pillThree,
    pillThreeContent,
    "pillThreeMedia": pillThreeMedia.asset->url,
    pillFour,
    pillFourContent,
    "pillFourMedia": pillFourMedia.asset->url,

    // ---------- SINGLE CASE STUDY ----------
   caseStudy->{
  _id,
  _type,
  projectTitle,
  projectDate,
  collaborationModel,
  "slug": slug.current,
  "heroMedia": heroMedia.asset->url,
  dataOne,
  dataTwo,
  dataThree,
},
summary,
results,
timeFrame,

    // ---------- MEDIA CAROUSEL WITH TEXT ----------
    mediaContent[]->{
      _id,
      _type,
      labelText,
      textContent,
      "fileUrl": mediaContent.asset->url
    },

// ---------- COMPARISON TABLE ----------
richTxt,
title1,
"positive": column1,
title2,
"negative": column2,

    // ---------- BENTO BOX ----------

      bentoTitle,
      ctaBox1,
      ctaLink1,
      ctaBox2,
      ctaLink2,

          // ---------- TESTIMONIALS CAROUSEL ----------
    carouselTitle,
    testimonials[]{
      _key,
      author,
      role,
      "logo": logo.asset->url,
      body,
    },

  }



}
`;
