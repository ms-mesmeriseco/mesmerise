// app/landing/[slug]/page.js
import LandingPageClient from "./LandingPageClient";
import { getClient } from "@/lib/apollo-client";
import { GET_LANDING_PAGE_HERO_BY_SLUG } from "@/lib/graphql/queries/getLandingPages";
import ContactForm from "@/app/connect/ContactForm";
import StaggeredWords from "@/hooks/StaggeredWords";

export const revalidate = 60;

const DEFAULT_OG_IMAGE =
  "https://www.mesmeriseco.com/assets/social-default.png";

function normalizeUrl(u) {
  if (!u) return u;
  if (u.startsWith("//")) return "https:" + u;
  if (u.startsWith("/")) return "https://www.mesmeriseco.com" + u;
  return u;
}

async function fetchLanding(slug) {
  if (!slug) {
    console.error("fetchLanding called with no slug");
    return null;
  }

  try {
    const { data, errors } = await getClient().query({
      query: GET_LANDING_PAGE_HERO_BY_SLUG,
      variables: { slug },
    });

    if (errors?.length) {
      console.error(
        "Contentful GraphQL errors in fetchLanding:",
        JSON.stringify(errors, null, 2)
      );
    }

    return data?.landingPageCollection?.items?.[0] || null;
  } catch (err) {
    console.error(
      "fetchLanding Contentful error:",
      err?.networkError?.result || err?.message || err
    );
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params; // <- unwrap the Promise

  const page = await fetchLanding(slug);

  const title = page?.mT || "Mesmerise Digital";
  const description =
    page?.metaDesc ||
    "We build omnipresent marketing ecosystems that unify design, data and psychology to drive predictable growth for ambitious brands.";

  const rawOg = page?.media?.url || page?.media?.[0]?.url || null;
  const ogImage = normalizeUrl(rawOg) || DEFAULT_OG_IMAGE;

  const url = `https://www.mesmeriseco.com/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params; // <- unwrap the Promise

  const page = await fetchLanding(slug);
  if (!page) return <p>Not found.</p>;

  return (
    <>
      <LandingPageClient page={page} />
      <div className="narrow-wrapper flex w-full flex-col md:flex-row justify-between gap-[var(--global-margin-sm)]">
        <div className="w-full md:w-1/2 pb-6">
          <StaggeredWords as="h3" text="Book in for a strategy session." />
        </div>
        <div className="w-full md:w-1/2 pb-6">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
