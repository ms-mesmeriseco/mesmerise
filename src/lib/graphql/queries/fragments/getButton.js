import { gql } from "@apollo/client";

export const GET_BUTTON = gql`
  fragment b on Button {
    a
    l
  }
`;
