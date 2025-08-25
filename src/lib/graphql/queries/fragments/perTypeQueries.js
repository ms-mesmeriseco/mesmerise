// fragments/perTypeQueries.js
import { gql } from "@apollo/client";
import { GET_HERO_DETAILS } from "./getHeroDetails";
import { GET_LIST_ICONS } from "./getListIcons";
import { GET_TRUST_BADGES } from "./trustBadgesFragment";
import { GET_LIST_SWITCH } from "./getListSwitch";
import { PILL_BLOCK_FRAGMENT } from "./pillBlockFragment";
import { GET_TWO_COLUMN } from "./getTwoColumn";
import { GET_SINGLE_COLUMN } from "./singleColumn";
import { GET_THREE_COLUMN } from "./getThreeColumn";
import { GET_SINGLE_CASESTUDY } from "./getSingleCaseStudy";
import { GET_MEDIA_CAROUSEL } from "./getMediaCarousel";

export const Q_HERO_BY_IDS = gql`
  query HeroByIds($ids: [String!]!) {
    results: componentHeroBannerCollection(
      where: { sys: { id_in: $ids } }
      limit: 1
    ) {
      items {
        __typename
        sys {
          id
        }
        ...HeroDetails
      }
    }
  }
  ${GET_HERO_DETAILS}
`;

export const Q_ICONROW_BY_IDS = gql`
  query IconRowByIds($ids: [String!]!) {
    results: iconRowCollection(where: { sys: { id_in: $ids } }, limit: 5) {
      items {
        __typename
        sys {
          id
        }
        ...IconRowFragment
      }
    }
  }
  ${GET_LIST_ICONS}
`;

export const Q_TRUSTBADGES_BY_IDS = gql`
  query TrustBadgesByIds($ids: [String!]!) {
    results: trustBadgesCollection(where: { sys: { id_in: $ids } }, limit: 2) {
      items {
        __typename
        sys {
          id
        }
        ...TrustBadgesFragment
      }
    }
  }
  ${GET_TRUST_BADGES}
`;

export const Q_SWITCH_BY_IDS = gql`
  query SwitchByIds($ids: [String!]!) {
    results: listWithImageSwitchCollection(
      where: { sys: { id_in: $ids } }
      limit: 2
    ) {
      items {
        __typename
        sys {
          id
        }
        ...SwitchListDetails
      }
    }
  }
  ${GET_LIST_SWITCH}
`;

export const Q_PILLBLOCK_BY_IDS = gql`
  query PillBlockByIds($ids: [String!]!) {
    results: pillBlockCollection(where: { sys: { id_in: $ids } }, limit: 3) {
      items {
        __typename
        sys {
          id
        }
        ...PillBlockFragment
      }
    }
  }
  ${PILL_BLOCK_FRAGMENT}
`;

export const Q_TWOCOL_BY_IDS = gql`
  query TwoColByIds($ids: [String!]!) {
    results: twoColumnBlockBlankCollection(
      where: { sys: { id_in: $ids } }
      limit: 8
    ) {
      items {
        __typename
        sys {
          id
        }
        ...TwoColumn
      }
    }
  }
  ${GET_TWO_COLUMN}
`;

export const Q_SINGLECOL_BY_IDS = gql`
  query SingleColByIds($ids: [String!]!) {
    results: singleColumnBlockBlankCollection(
      where: { sys: { id_in: $ids } }
      limit: 5
    ) {
      items {
        __typename
        sys {
          id
        }
        ...SingleColumn
      }
    }
  }
  ${GET_SINGLE_COLUMN}
`;

export const Q_THREECOL_BY_IDS = gql`
  query ThreeColByIds($ids: [String!]!) {
    results: threeColumnBlockBlankCollection(
      where: { sys: { id_in: $ids } }
      limit: 5
    ) {
      items {
        __typename
        sys {
          id
        }
        ...ThreeColumn
      }
    }
  }
  ${GET_THREE_COLUMN}
`;

export const Q_SINGLESTUDY_BY_IDS = gql`
  query SingleStudyByIds($ids: [String!]!) {
    results: singleCaseStudyCollection(
      where: { sys: { id_in: $ids } }
      limit: 3
    ) {
      items {
        __typename
        sys {
          id
        }
        ...SingleStudy
      }
    }
  }
  ${GET_SINGLE_CASESTUDY}
`;

export const Q_MEDIACARO_BY_IDS = gql`
  query MediaCarouselByIds($ids: [String!]!) {
    results: mediaCarouselWithTextCollection(
      where: { sys: { id_in: $ids } }
      limit: 3
    ) {
      items {
        __typename
        sys {
          id
        }
        ...MediaCarouselWithTextFragment
      }
    }
  }
  ${GET_MEDIA_CAROUSEL}
`;
