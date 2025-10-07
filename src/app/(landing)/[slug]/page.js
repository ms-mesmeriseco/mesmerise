// app/landing/[slug]/page.js
import LandingPageClient from "./LandingPageClient";
import { getClient } from "@/lib/apollo-client";
import { GET_LANDING_PAGE_BY_SLUG } from "@/lib/graphql/queries/getLandingPages";
import ContactForm from "@/app/connect/ContactForm";
import StaggeredWords from "@/hooks/StaggeredWords";

export const revalidate = 60; // optional: ISR

const DEFAULT_OG_IMAGE = "https://mesmeriseco.com/assets/social-default.png";

function normalizeUrl(u) {
  if (!u) return u;
  if (u.startsWith("//")) return "https:" + u; // protocol-relative (e.g. Contentful)
  if (u.startsWith("/")) return "https://mesmeriseco.com" + u; // site-relative
  return u; // already absolute
}

async function fetchLanding(slug) {
  const { data } = await getClient().query({
    query: GET_LANDING_PAGE_BY_SLUG,
    variables: { slug },
  });
  return data?.landingPageCollection?.items?.[0] || null;
}

export async function generateMetadata({ params }) {
  const page = await fetchLanding(params.slug);

  const title = page?.mT || "Mesmerise Digital";
  const description =
    page?.metaDesc ||
    "We build omnipresent marketing ecosystems that unify design, data and psychology to drive predictable growth for ambitious brands.";

  // Safely resolve an OG image (object or array), normalize to absolute URL, then fallback
  const rawOg = page?.media?.url || page?.media?.[0]?.url || null;

  const ogImage = normalizeUrl(rawOg) || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://mesmeriseco.com/${params.slug}`,
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
      images: [ogImage], // keep Twitter in sync with OG
    },
    alternates: {
      canonical: `/${params.slug}`,
    },
  };
}

export default async function Page({ params }) {
  const page = await fetchLanding(params.slug);
  if (!page) return <p>Not found.</p>;
  return (
    <>
      <LandingPageClient page={page} />
      <div className="narrow-wrapper flex w-full flex-col md:flex-row justify-between gap-[var(--global-margin-sm)]">
        <div className="w-full md:w-1/2 pb-6">
          {" "}
          <StaggeredWords as="h3" text="Book in for a strategy session." />
        </div>
        <div className="w-full md:w-1/2 pb-6">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
