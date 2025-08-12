// lib/graphql/fragments/richTextHyperlinks.ts
import { gql } from "@apollo/client";

export const ENTRY_HYPERLINK_TARGETS = gql`
  fragment EntryHyperlinkTargets on Entry {
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
`;

export const ASSET_HYPERLINK_FIELDS = gql`
  fragment AssetHyperlinkFields on Asset {
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
`;

export const RICHTEXT_HYPERLINKS = gql`
  fragment RichTextHyperlinks on RichText {
    links {
      entries {
        hyperlink {
          ...EntryHyperlinkTargets
        }
      }
      assets {
        hyperlink {
          ...AssetHyperlinkFields
        }
      }
    }
  }
  ${ENTRY_HYPERLINK_TARGETS}
  ${ASSET_HYPERLINK_FIELDS}
`;
