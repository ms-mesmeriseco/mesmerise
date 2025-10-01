import { gql } from "@apollo/client";

export const GET_BUTTON = gql`
  fragment ButtonDetails on Button {
    ctaLab
    ctaLi
  }
`;
