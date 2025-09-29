// app/landing/[slug]/page.js
import LandingPageClient from "./LandingPageClient";
import { getClient } from "@/lib/apollo-client";
import { GET_LANDING_PAGE_BY_SLUG } from "@/lib/graphql/queries/getLandingPages";

export const revalidate = 60; // optional: ISR

async function fetchLanding(slug) {
  const { data } = await getClient().query({
    query: GET_LANDING_PAGE_BY_SLUG,
    variables: { slug },
  });
  return data?.landingPageCollection?.items?.[0] || null;
}

export async function generateMetadata({ params }) {
  const page = await fetchLanding(params.slug);

  const title = page?.mT || "MESMERISE | Digital Marketing & Brand Strategy";
  const description =
    page?.metaDesc ||
    "Strategy, brand, web, and content that look great and convert.";

  return {
    title,
    description,
    // optional nice-to-haves:
    openGraph: {
      title,
      description,
      url: `https://your-domain.com/landing/${params.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/landing/${params.slug}`,
    },
  };
}

export default async function Page({ params }) {
  const page = await fetchLanding(params.slug);
  if (!page) return <p>Not found.</p>;
  return <LandingPageClient page={page} />;
}
