// app/landing/[slug]/page.js
import LandingPageClient from "./LandingPageClient";
import { sanityClient } from "@/sanity/client";
import { landingBySlugQuery } from "@/lib/sanity/landing";
import ContactForm from "@/app/connect/ContactForm";
import StaggeredWords from "@/hooks/StaggeredWords";
import { notFound } from "next/navigation";

export const revalidate = 60;

const DEFAULT_OG_IMAGE =
  "https://www.mesmeriseco.com/assets/social-default.png";

function normalizeUrl(u) {
  if (!u) return u;
  if (u.startsWith("//")) return "https:" + u;
  if (u.startsWith("/")) return "https://www.mesmeriseco.com" + u;
  return u;
}

// Turn portable text metaDesc into plain text for <meta> tags
function blocksToPlainText(blocks) {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((block) => block._type === "block" && Array.isArray(block.children))
    .map((block) => block.children.map((child) => child.text).join(""))
    .join(" ");
}

async function fetchLanding(slug) {
  if (!slug) {
    // This should now *only* happen if you call it wrong
    console.error("fetchLanding called with no slug");
    return null;
  }

  try {
    const page = await sanityClient.fetch(landingBySlugQuery, { slug });

    if (!page) {
      console.warn(`No landing page found in Sanity for slug "${slug}"`);
    }

    return page;
  } catch (err) {
    console.error("fetchLanding Sanity error:", err);
    return null;
  }
}

// =======================
//   METADATA FROM SANITY
// =======================
export async function generateMetadata({ params }) {
  const { slug } = await params; // keep this consistent with your work page

  // Guard: don't hit fetchLanding with an empty slug
  if (!slug) {
    return {
      title: "Mesmerise Digital",
      description:
        "We build omnipresent marketing ecosystems that unify design, data and psychology to drive predictable growth for ambitious brands.",
    };
  }

  const page = await fetchLanding(slug);

  if (!page) {
    return {
      title: "Mesmerise Digital",
      description:
        "We build omnipresent marketing ecosystems that unify design, data and psychology to drive predictable growth for ambitious brands.",
    };
  }

  const title = page.mT || page.pageTitle || "Mesmerise Digital";

  const description =
    (page.metaDesc && blocksToPlainText(page.metaDesc)) ||
    "We build omnipresent marketing ecosystems that unify design, data and psychology to drive predictable growth for ambitious brands.";

  const rawOg = page.media?.url || null;
  const ogImage = normalizeUrl(rawOg) || DEFAULT_OG_IMAGE;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mesmeriseco.com";
  // adjust this if your route is actually /landing/[slug]
  const canonicalUrl = `${baseUrl}/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
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
  };
}

// =============
//   PAGE BODY
// =============
export default async function Page({ params }) {
  const { slug } = await params; // mirror your working pattern

  if (!slug) {
    return notFound();
  }

  const page = await fetchLanding(slug);

  if (!page) {
    return notFound();
  }
  console.log(page);
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
