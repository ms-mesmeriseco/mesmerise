import ClickableImage from "@/components/ui/ClickableImage";
import ServiceTags from "@/components/services/ServiceTags";
import StaggeredChildren from "@/hooks/StaggeredChildren";
import StaggeredWords from "@/hooks/StaggeredWords";
import RelatedProjects from "@/components/sanity-blocks/RelatedProjects";

import { sanityClient } from "@/sanity/client";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";

// -------- GROQ QUERY (single project by slug) --------
const PROJECT_QUERY = groq`
  *[_type == "projectPage" && slug.current == $slug][0]{
    _id,
    projectTitle,
    "slug": slug.current,
    projectDate,
    collaborationModel,
    "serviceTags": serviceTags[]->title,
    projectScope,
    dataOne,
    dataTwo,
    dataThree,
    extendedDescription,
    heroMedia{
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "alt": coalesce(alt, asset->originalFilename)
    },
    mediaGallery[]{
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "mimeType": asset->mimeType,
      "filename": asset->originalFilename
    }
  }
`;

const ALL_PROJECTS_QUERY = groq`
  *[_type == "projectPage"]{
    _id,
    projectTitle,
    "slug": slug.current,
    projectDate,
    "serviceTags": serviceTags[]->title,
    heroMedia{ "url": asset->url, "alt": coalesce(alt, asset->originalFilename) }
  }
`;

// -------- helper to render Sanity blocks very simply --------
function renderBlocks(blocks, { h2Class = "", pClass = "" } = {}) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return blocks
    .filter((block) => block && block._type === "block")
    .map((block, idx) => {
      const text = block.children?.map((child) => child.text).join("") ?? "";

      if (block.style === "h2") {
        return (
          <h2 key={idx} className={h2Class}>
            {text}
          </h2>
        );
      }

      return (
        <p key={idx} className={pClass}>
          {text}
        </p>
      );
    });
}

// =======================
//   METADATA FROM SANITY
// =======================
export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (!slug) {
    return {
      title: "Project | Mesmerise Digital",
      description:
        "Explore how ambitious brands scaled with Mesmerise. From booked out calendars to 25x ROAS, data-backed proof, not promises.",
    };
  }

  const page = await sanityClient.fetch(PROJECT_QUERY, { slug });

  if (!page) {
    return {
      title: "Project | Mesmerise Digital",
      description:
        "Explore how ambitious brands scaled with Mesmerise. From booked out calendars to 25x ROAS, data-backed proof, not promises.",
    };
  }

  const projectName = page.projectTitle || "Project";

  const title = `${projectName} | Mesmerise Digital`;
  const description =
    page.metaDescription ||
    "Explore how ambitious brands scaled with Mesmerise. From booked out calendars to 25x ROAS, data-backed proof, not promises.";

  const baseUrl = "https://www.mesmeriseco.com";
  const canonicalUrl = `${baseUrl}/work/${slug}`;

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
          url: page.heroMedia?.url || `${baseUrl}/assets/social-default.png`,
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
      images: [page.heroMedia?.url || `${baseUrl}/assets/social-default.png`],
    },
  };
}

// =============
//   PAGE BODY
// =============
export default async function ProjectPage({ params }) {
  const { slug } = await params; // 👈 same here

  if (!slug) {
    return notFound();
  }

  // Fetch both in parallel for better performance
  const [page, allProjects] = await Promise.all([
    sanityClient.fetch(PROJECT_QUERY, { slug }),
    sanityClient.fetch(ALL_PROJECTS_QUERY),
  ]);

  if (!page) {
    return notFound();
  }

  const formattedDate = page.projectDate
    ? new Date(page.projectDate).toLocaleString("en-AU", {
        year: "numeric",
      })
    : "";
  console.log("SERVICE TAGS (clean):", page.serviceTags);
  const tagArray = Array.isArray(page.serviceTags) ? page.serviceTags : [];

  return (
    <>
      <main className="grid grid-cols-12 gap-x-[var(--global-margin-sm)] gap-y-[var(--global-margin-sm)]">
        {/* --- HERO ROW --- */}
        <div className="col-span-12 md:col-span-12 lg:min-h-[80vh] md:min-h-[50vh] sm:min-h-[30vh] h-[60vh]">
          {page.heroMedia?.url && (
            <ClickableImage
              src={page.heroMedia.url}
              alt={page.heroMedia.alt || page.projectTitle}
              width={page.heroMedia.width}
              height={page.heroMedia.height}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* --- DATA CARDS --- */}
        {page.dataOne && page.dataOne.length > 0 && (
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-2 text-left pt-4 border-t border-[var(--mesm-grey)] h-full">
            {/* Data One */}
            <div className="text-base leading-relaxed h2:text-lg [&>p+p]:mt-4 border-1 border-[var(--mesm-grey-dk)] p-4 rounded-md">
              <StaggeredChildren baseDelay={0} once={true}>
                {renderBlocks(page.dataOne, {
                  h2Class: "page-title-large",
                })}
              </StaggeredChildren>
            </div>

            {/* Data Two */}
            {page.dataTwo && page.dataTwo.length > 0 && (
              <div className="text-base leading-relaxed [&>p+p]:mt-4 border-1 border-[var(--mesm-grey-dk)] p-4 rounded-md">
                <StaggeredChildren baseDelay={0.2} once={true}>
                  {renderBlocks(page.dataTwo, {
                    h2Class: "page-title-large",
                  })}
                </StaggeredChildren>
              </div>
            )}

            {/* Data Three */}
            {page.dataThree && page.dataThree.length > 0 && (
              <div className="text-base leading-relaxed [&>p+p]:mt-4 border-1 border-[var(--mesm-grey-dk)] p-4 rounded-md">
                <StaggeredChildren baseDelay={0.4} once={true}>
                  {renderBlocks(page.dataThree, {
                    h2Class: "page-title-large",
                  })}
                </StaggeredChildren>
              </div>
            )}
          </div>
        )}

        {/* divider row */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left border-t border-[var(--mesm-grey)]" />

        {/* --- LEFT COLUMN: PROJECT META --- */}
        <div className="col-span-12 lg:col-span-6 rounded-lg flex flex-col gap-2 md:max-w-[475px]">
          <h1 className="">{page.projectTitle}</h1>
          <h6>{formattedDate}</h6>

          {/* If you later change collaborationModel to string, render it here */}
          {typeof page.collaborationModel === "string" && (
            <h6>{page.collaborationModel}</h6>
          )}

          {page.projectScope && page.projectScope.length > 0 && (
            <>
              <StaggeredWords as="h6" text="Project scope" className="" />
              <div className="text-base leading-relaxed [&>p+p]:mt-4">
                {renderBlocks(page.projectScope, {
                  pClass: "p4",
                })}
              </div>
            </>
          )}
        </div>

        {/* --- TAGS --- */}
        <div className="inline-flex md:col-span-3 col-span-12 gap-2 ">
          <ServiceTags items={page.serviceTags} large={false} />
        </div>

        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left border-t border-[var(--mesm-grey)]" />

        {/* --- EXTENDED DESCRIPTION --- */}
        {page.extendedDescription && page.extendedDescription.length > 0 && (
          <div className="col-span-12 min-h-[50vh] py-8">
            <div className="text-base md:w-1/2 ml-auto w-full leading-relaxed ">
              <div className="max-w-[475px]">
                {renderBlocks(page.extendedDescription, {
                  pClass: "p2 mb-6",
                })}
              </div>
            </div>
          </div>
        )}

        {page.mediaGallery?.map((media, idx, arr) => {
          const mod = idx % 3; // 0 -> full, 1 & 2 -> halves
          const isLast = idx === arr.length - 1;

          let colSpan = "col-span-12";
          if (mod !== 0) {
            colSpan = "col-span-12 md:col-span-6";
            if (isLast && mod === 1) colSpan = "col-span-12";
          }

          const isVideo =
            media.mimeType?.startsWith("video/") ||
            media.url?.toLowerCase().includes(".mp4");

          return (
            <div key={idx} className={colSpan}>
              {isVideo ? (
                <video
                  src={media.url}
                  controls
                  autoPlay
                  loop
                  muted
                  className="w-full h-[50vh] object-cover"
                />
              ) : (
                <ClickableImage
                  src={media.url}
                  width={media.width}
                  height={media.height}
                  alt={media.filename || `Gallery media ${idx}`}
                  className="w-full h-[50vh] object-cover hover:opacity-80 transition-opacity"
                />
              )}
            </div>
          );
        })}
      </main>
      <RelatedProjects projects={allProjects} currentProject={page} />
    </>
  );
}
