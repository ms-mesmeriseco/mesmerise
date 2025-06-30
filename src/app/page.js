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
  const singleColumn = blocks.find(
    (block) => block.__typename === "SingleColumnBlockBlank"
  );
  const richTextEntry = singleColumn?.contentCollection?.items?.find(
    (item) => item.__typename === "ContentTypeRichText"
  );

  const imageEntry = singleColumn?.contentCollection?.items?.find(
    (item) => item.__typename === "Image"
  );

  const twoColumnBlock = blocks.find(
    (block) => block.__typename === "TwoColumnBlockBlank"
  );

  const column1 = twoColumnBlock?.column1Collection?.items || [];
  const column2 = twoColumnBlock?.column2Collection?.items || [];
  const richTextJson = richTextEntry?.content?.json;
  const imageUrl = imageEntry?.imageContent?.url;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-16 m-4">
      <HeroBanner
        heroMedia={heroBannerBlock?.heroMedia}
        heroText={heroBannerBlock?.heroText}
      />

      <main className="flex flex-col gap-8">
       <SingleColumn richText={richTextJson} imageUrl={imageUrl} />
       {twoColumnBlock && (
        <TwoColumn column1={column1} column2={column2} />
      )}
      </main>
    </div>
  );
}
