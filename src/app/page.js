import { getClient } from "@/lib/apollo-client";
import { GET_HOME_PAGE } from "@/lib/graphql/queries/getHomePageContent";
import HeroBanner from "@/components/blocks/HeroBanner";
import SingleColumn from "@/components/blocks/SingleColumn";
import TwoColumn from "@/components/blocks/TwoColumn";

export default async function Home() {
  const { data } = await getClient().query({ query: GET_HOME_PAGE });
  const page = data.homePageCollection.items[0];
  const blocks = page.pageBlocksCollection.items;

  const heroBannerBlock = blocks.find(
    (block) => block.__typename === "ComponentHeroBanner"
  );
  const singleColumnBlock = blocks.find(
    (block) => block.__typename === "SingleColumnBlockBlank"
  );

  const content = singleColumnBlock?.contentCollection?.items || [];

  const twoColumnBlock = blocks.find(
    (block) => block.__typename === "TwoColumnBlockBlank"
  );

  const column1 = twoColumnBlock?.column1Collection?.items || [];
  const column2 = twoColumnBlock?.column2Collection?.items || [];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-16">
      <HeroBanner
        heroMedia={heroBannerBlock?.heroMedia}
        heroText={heroBannerBlock?.heroText}
        mediaHeight={heroBannerBlock?.mediaHeight}
      />

      <main className="flex flex-col gap-8">
       {singleColumnBlock && <SingleColumn content={content} />}
       {twoColumnBlock && (
        <TwoColumn column1={column1} column2={column2} />
      )}
      </main>
    </div>
  );
}
