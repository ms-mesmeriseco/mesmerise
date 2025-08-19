import { gql } from "@apollo/client";
import { PILL_BLOCK_FRAGMENT } from "./fragments/pillBlockFragment";
import { GET_TRUST_BADGES } from "./fragments/trustBadgesFragment";
import { GET_LIST_SWITCH } from "./fragments/getListSwitch";
import { GET_HERO_DETAILS } from "./fragments/getHeroDetails";
import { GET_LIST_ICONS } from "./fragments/getListIcons";
import { GET_ACCORDION } from "./fragments/getAccordion";
import { GET_IMAGE } from "./fragments/getImage";
import { GET_VIDEO } from "./fragments/getVideo";
import { GET_TWO_COLUMN } from "./fragments/getTwoColumn";
import { GET_SINGLE_COLUMN } from "./fragments/singleColumn";
import { GET_SINGLE_CASESTUDY } from "./fragments/getSingleCaseStudy";
import { GET_MEDIA_CAROUSEL } from "./fragments/getMediaCarousel";

export const GET_LANDING_PAGE_BY_SLUG = gql`
  query GetLandingPageBySlug($slug: String!) {
    landingPageCollection(limit: 1, where: { pageSlug: $slug }) {
      items {
        __typename
        sys {
          id
        }
        pageTitle
        pageSlug

        pageBlocksCollection(limit: 20) {
          items {
            ... on ComponentHeroBanner {
              ...HeroDetails
            }
            ... on IconRow {
              ...IconRowFragment
            }
            ... on TrustBadges {
              ...TrustBadgesFragment
            }
            ... on ListWithImageSwitch {
              ...SwitchListDetails
            }
            ... on PillBlock {
              ...PillBlockFragment
            }
            ... on TwoColumnBlockBlank {
              ...TwoColumn
            }
            ... on SingleColumnBlockBlank {
              ...SingleColumn
            }
            ... on SingleCaseStudy {
              ...SingleStudy
            }
            ... on MediaCarouselWithText {
              ...MediaCarouselWithTextFragment
            }
          }
        }
      }
    }
  }
  ${GET_MEDIA_CAROUSEL}
  ${GET_SINGLE_CASESTUDY}
  ${GET_SINGLE_COLUMN}
  ${GET_TWO_COLUMN}
  ${GET_VIDEO}
  ${GET_IMAGE}
  ${GET_ACCORDION}
  ${GET_LIST_ICONS}
  ${GET_HERO_DETAILS}
  ${GET_LIST_SWITCH}
  ${GET_TRUST_BADGES}
  ${PILL_BLOCK_FRAGMENT}
`;

export const GET_ALL_LANDING_PAGES = gql`
  query GetAllLandingPages {
    landingPageCollection {
      items {
        pageTitle
        pageSlug
        metaDescription {
          json
        }
        metaTitle
      }
    }
  }
`;
