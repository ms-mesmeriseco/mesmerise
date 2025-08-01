import { gql } from "@apollo/client";       
import { GET_PROJECT_DATA } from "./getProjects";

export const GET_SINGLE_CASESTUDY = gql`
    fragment SingleStudy on SingleCaseStudy {
        caseStudy {
        ...ProjectData
        }
        summary {
        json
        }
        results {
        json
        }
        timeFrame
    }
${GET_PROJECT_DATA}
`;  