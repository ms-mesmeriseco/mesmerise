import { gql } from "@apollo/client";
import { PILL_BLOCK_FRAGMENT } from "./fragments/pillBlockFragment";
import { GET_TRUST_BADGES } from "./fragments/trustBadgesFragment";
import { GET_LIST_SWITCH } from "./fragments/getListSwitch";
import { GET_LIST_ICONS } from "./fragments/getListIcons";
import { GET_ACCORDION } from "./fragments/getAccordion";
import { GET_IMAGE } from "./fragments/getImage";
import { GET_VIDEO } from "./fragments/getVideo";
import { GET_TWO_COLUMN } from "./fragments/getTwoColumn";
import { GET_SINGLE_COLUMN } from "./fragments/singleColumn";
import { GET_THREE_COLUMN } from "./fragments/getThreeColumn";
import { GET_SINGLE_CASESTUDY } from "./fragments/getSingleCaseStudy";
import { GET_MEDIA_CAROUSEL } from "./fragments/getMediaCarousel";
import { GET_TABLE } from "./fragments/getTable";

function minifyGraphQL(query) {
  return query
    .replace(/\s+/g, " ")
    .replace(/\s*([{}():,])\s*/g, "$1")
    .trim();
}
const rawQuery = `
  query GetLandingPageBySlug($slug: String!) {
    landingPageCollection(limit: 1, where: { pageSlug: $slug }) {
      items {
        __typename
        sys {
          id
        }
        pageTitle
        pageSlug
        mT
        metaDesc
        line1
        sub
        heroList {
        json
        }
        align
        media {
        url
        contentType 
        }
        hE {
        json}
        ctaLab
        trustCollection (limit:8) {
          items {
            url
            description
            height
            width
          }
        }
        pageBlocksCollection(limit: 15) {
          items {
            ... on IconRow {
              ...IconRowFragment
            }
            ... on ListWithImageSwitch {
              ...Switch
            }
            ... on PillBlock {
              ...Pill
            }
            ... on TwoColumnBlockBlank {
              ...TwoColumn
            }
            ... on SingleColumnBlockBlank {
              ...SingleColumn
            }
            ... on ThreeColumnBlockBlank {
              ...ThreeColumn
            }
            ... on SingleCaseStudy {
              ...SingleStudy
            }
            ... on MediaCarouselWithText {
              ...MTFrag
            }
            ...on ComparisonTable {
              ...Table
            }
          }
        }
      }
    }
  }
`;

const minifiedQuery = minifyGraphQL(rawQuery);

export const GET_LANDING_PAGE_BY_SLUG = gql`
  ${minifiedQuery}
  ${GET_MEDIA_CAROUSEL}
  ${GET_SINGLE_CASESTUDY}
  ${GET_THREE_COLUMN}
  ${GET_SINGLE_COLUMN}
  ${GET_TWO_COLUMN}
  ${GET_VIDEO}
  ${GET_IMAGE}
  ${GET_ACCORDION}
  ${GET_LIST_ICONS}
  ${GET_LIST_SWITCH}
  ${PILL_BLOCK_FRAGMENT}
  ${GET_TABLE}
`;

export const GET_ALL_LANDING_PAGES = gql`
  query GetAllLandingPages {
    landingPageCollection(limit: 20) {
      items {
        pageTitle
        pageSlug
        mT
        metaDesc
      }
    }
  }
`;
