import { getClient } from "@/lib/apollo-client";
import { GET_LANDING_PAGES } from "@/lib/graphql/queries/getLandingPages";
import HeroBanner from "@/components/blocks/HeroBanner";
import { notFound } from "next/navigation";

export default async function LandingPage({ params }) {
  const slug = params.slug;

  const { data } = await getClient().query({
    query: GET_LANDING_PAGES,
    variables: { slug },
  });


  const page = data.landingPageCollection.items[0];
  console.log(page);

  if (!page) {
    notFound(); // or return a fallback component
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-16 m-4">
  

      <main className="flex flex-col gap-8">
        <p className="text-lg max-w-prose text-center">
          Tailored content for: <strong>{page.pageTitle}</strong>
        </p>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const { data } = await getClient().query({
    query: GET_LANDING_PAGES,
  });

  return data.landingPageCollection.items.map((page) => ({
    slug: page.pageSlug,
  }));
}