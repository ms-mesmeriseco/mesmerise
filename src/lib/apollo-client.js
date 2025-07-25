import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function getClient() {
  const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const token = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

  const link = new HttpLink({
    uri: `https://graphql.contentful.com/content/v1/spaces/${space}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    fetch,
  });

  return new ApolloClient({
    ssrMode: true,
    link,
    cache: new InMemoryCache(),
  });
}
