import { getClient } from "@/lib/apollo-client";
import { GET_HOME_PAGE } from "@/lib/graphql/queries/getHomePageContent";
import PageBase from "@/components/layout/PageBase";

export default async function Home() {
  const { data } = await getClient().query({ query: GET_HOME_PAGE });
  const page = data.homePageCollection.items[0];
  const blocks = page.pageBlocksCollection.items;

  return <PageBase blocks={blocks} />;
}
