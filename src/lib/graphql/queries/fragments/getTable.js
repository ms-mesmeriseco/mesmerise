import { gql } from "@apollo/client";

export const GET_TABLE = gql`
  fragment TableFragment on ComparisonTable {
    richTxt {
      json
    }
    title1
    column1 {
      json
    }
    title2
    column2 {
      json
    }
  }
`;
