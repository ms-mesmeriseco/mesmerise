import { gql } from "@apollo/client";

export const GET_TABLE = gql`
  fragment TableFragment on ComparisonTable {
    blockTitle
    column1 {
      json
    }
  }
`;
