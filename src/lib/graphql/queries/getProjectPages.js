import { gql } from "@apollo/client";
import { GET_PROJECT_DATA } from "./fragments/getProjects";

export const GET_PROJECT_PAGES = gql`
  query GetProjectPages($preview: Boolean!) {
    projectPageCollection {
      items {
        ...ProjectData
      }
    }
  }
  ${GET_PROJECT_DATA}
`;
