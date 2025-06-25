import { getClient } from "@/lib/apollo-client";
import { GET_HOME_PAGE } from "@/lib/graphql/queries/getHomePageContent";
import HeroBanner from "@/components/blocks/HeroBanner";

export default async function Home() {
  const { data } = await getClient().query({ query: GET_HOME_PAGE });
  const page = data.homePageCollection.items[0];
  const blocks = page.pageBlocksCollection.items;

  const heroBannerBlock = blocks.find(
    (block) => block.__typename === "ComponentHeroBanner"
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-16 m-4">
      <HeroBanner
        heroMedia={heroBannerBlock?.heroMedia}
        heroText={heroBannerBlock?.heroText}
      />

      <main className="flex flex-col gap-8">
        <p className="text-lg max-w-prose text-center">
          Skyrocket your lead generation. Install a predictable growth engine into your business that will automate your revenue growth in 90 days.
        </p>
      </main>
    </div>
  );
}
