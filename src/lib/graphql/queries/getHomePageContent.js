import { gql } from '@apollo/client'
import { GET_PAGE_BLOCKS } from '../fragments/getPageBlocks'

export const GET_HOME_PAGE = gql`

    query GetHomePage {
        homePageCollection(limit: 1) {
            items {
             __typename
    				sys { id }
                pageTitle
                pageSlug
                pageBlocksCollection (limit: 10) {
                    items {
                           ... on ComponentHeroBanner {
                                heroText {
                                    json
                                }
                                heroMedia {
                                    url
                                    title
                                    description
                                    width
                                    height
                                    contentType
                                    fileName
                                }
                                }
                                ... on SingleColumnBlockBlank {
                                    contentCollection {
                                        items {
                                            ... on ContentTypeRichText {
                                                content {
                                                json
                                                }
                                            }
                                            ... on Image {
                                                    imageContent {
                                                        url
                                                        title
                                                        description
                                                        width
                                                        height
                                                        contentType
                                                        fileName
                                                    }
                                            
                                            }
                                        }
                                    }
                                }
                    }
                }
            }
        }
    }

`;