import { Suspense } from "react";
import { groq } from "next-sanity";
import { sanityClient } from "@/sanity/client";
import ProjectNavList from "@/components/sanity-blocks/ProjectNavList";
import PageTitleLarge from "@/components/ui/PageTitleLarge";

export async function generateMetadata() {
  const title = "View our work | Mesmerise Digital";
  const description =
    "Explore how ambitious brands scaled with Mesmerise. From booked out calendars to 25x ROAS, data backed proof not promises.";
  const baseUrl = "https://www.mesmeriseco.com";
  const canonicalUrl = `/work/`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Mesmerise Digital",
      images: [
        {
          url: `${baseUrl}/assets/social-default.png`,
          width: 1200,
          height: 630,
          alt: projectName,
        },
      ],
      locale: "en_AU",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: `${baseUrl}/assets/social-default.png`,
    },
  };
}

const projectsQuery = groq`*[_type == "projectPage"]{
  _id,
  projectTitle,
  "slug": slug.current,
  projectDate,
  collaborationModel,
serviceTags[]->{
  _id,
  title,
  "slug": slug.current
},
  heroMedia{
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "alt": coalesce(alt, asset->originalFilename)
    },
}`;

async function fetchProjects() {
  try {
    const data = await sanityClient.fetch(projectsQuery);
    return data || [];
  } catch (err) {
    console.error("Error fetching projects for /work:", err);
    return [];
  }
}

export default async function Work({ searchParams }) {
  const tagParam = await searchParams?.tag;
  const activeTag = Array.isArray(tagParam) ? tagParam[0] : (tagParam ?? null);

  const projects = await fetchProjects();
  console.log("SERVICE TAGS (raw):", projects.serviceTags);

  return (
    <div className="flex flex-col min-h-screen mb-[4rem]">
      <PageTitleLarge text="Work" />
      {/* Suspense isn't strictly needed now, but you can keep or remove it */}
      <Suspense fallback={<p>Loading projects...</p>}>
        <ProjectNavList activeTag={activeTag} projects={projects} />
      </Suspense>
    </div>
  );
}
