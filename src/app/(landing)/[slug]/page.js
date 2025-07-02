import { getClient } from "@/lib/apollo-client";
import { GET_LANDING_PAGE_BY_SLUG } from "@/lib/graphql/queries/getLandingPages";
import PageBase from "@/components/layout/PageBase";

export default async function LandingPage({ params }) {
  const { slug } = params;
  const { data } = await getClient().query({
    query: GET_LANDING_PAGE_BY_SLUG,
    variables: { slug },
  });

  const page = data.landingPageCollection.items[0];

  if (!page) return <p>Page not found</p>;

  const blocks = page.pageBlocksCollection.items;

  return <PageBase blocks={blocks} />;
}