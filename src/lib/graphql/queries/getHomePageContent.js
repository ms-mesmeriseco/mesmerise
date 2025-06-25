import { gql } from '@apollo/client'
import { GET_PAGE_BLOCKS } from '../fragments/getPageBlocks'

export const GET_HOME_PAGE = gql`
${GET_PAGE_BLOCKS}
    query GetHomePage {
        homePageCollection(limit: 1) {
        items {
            pageTitle
            pageSlug
            metaText {
            json
            }
            heroImage {
                url
                title
                description
                width
                height
                contentType
                fileName
            }
            pageBlocksCollection {
            items {
                ...PageBlocks
            }
            }
        }
        }
    }
`;