// lib/apollo-client.js
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function getClient({ preview = false } = {}) {
  // Prefer server-only env vars; fall back to existing NEXT_PUBLIC ones if needed
  const space =
    process.env.CONTENTFUL_SPACE_ID ||
    process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const environment = process.env.CONTENTFUL_ENVIRONMENT_ID || "master";

  const deliveryToken =
    process.env.CONTENTFUL_DELIVERY_TOKEN ||
    process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN; // your current token name
  const previewToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;

  const token = preview ? previewToken : deliveryToken;

  if (!space || !token) {
    throw new Error(
      `Contentful config missing. Got space="${space}", token present=${Boolean(
        token
      )}. Make sure SPACE_ID and the ${
        preview ? "PREVIEW" : "DELIVERY"
      } token are set.`
    );
  }

  const link = new HttpLink({
    uri: `https://graphql.contentful.com/content/v1/spaces/${space}/environments/${environment}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Keep your explicit fetch usage
    fetch,
    // For preview, strongly discourage caching at the fetch level
    fetchOptions: preview ? { cache: "no-store" } : undefined,
  });

  return new ApolloClient({
    ssrMode: true,
    link,
    cache: new InMemoryCache(),
    // For preview, also disable Apollo’s own caching
    defaultOptions: preview
      ? {
          query: { fetchPolicy: "no-cache" },
          watchQuery: { fetchPolicy: "no-cache" },
        }
      : undefined,
  });
}
