// "use client";

import { getClient } from "../../../lib/apollo-client";
import { GET_PROJECT_PAGES } from "@/lib/graphql/queries/getProjectPages";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";
import ServiceTags from "@/components/services/ServiceTags";
import Image from "next/image";
import StaggeredChildren from "@/hooks/StaggeredChildren";
import StaggeredWords from "@/hooks/StaggeredWords";
import richTextParagraphs from "@/lib/utils/richTextParagraphs";

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const { data } = await getClient().query({ query: GET_PROJECT_PAGES });
  const page = data.projectPageCollection.items.find(
    (post) => post.slug === slug
  );
  if (!page) return <p>Blog post not found.</p>;

  const formattedDate = new Date(page.projectDate).toLocaleString("en-AU", {
    year: "numeric",
  });

  return (
    <main className="grid grid-cols-12 gap-x-[var(--global-margin-sm)] gap-y-[var(--global-margin-sm)] p-[var(--global-margin-lg)]">
      {/* --- HERO ROW --- */}
      <div className="col-span-12 lg:col-span-8 lg:min-h-[80vh]  md:min-h-[50vh] sm:min-h-[30vh] h-screen">
        <Image
          src={page.heroMedia.url}
          alt={page.heroMedia.title}
          width={page.heroMedia.width}
          height={page.heroMedia.height}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="col-span-12 lg:col-span-4 border-1 border-[var(--mesm-grey-dk)] p-[var(--global-margin-sm)] rounded-lg flex flex-col gap-4 lg:min-h-[80vh]  md:min-h-[50vh] sm:min-h-[30vh] h-screen">
        <h1 className="font-medium">{page.projectTitle}</h1>
        <h6 className="opacity-40">{formattedDate}</h6>
        <h6 className="opacity-40">{page.collaborationModel || ""}</h6>

        {page.projectScope?.json && (
          <>
            <StaggeredWords
              as="h6"
              text="PROJECT SCOPE"
              className="opacity-60"
            />
            <div className="text-base leading-relaxed [&>p+p]:mt-4">
              {richTextParagraphs(page.projectScope.json).map((p, i) => (
                <StaggeredWords
                  key={i}
                  as="p"
                  className="mb-4"
                  text={p}
                  // you can pass per-paragraph delays if your StaggeredWords supports it
                />
              ))}
            </div>

            {/* Optional non-animated fallback (keep or remove): */}
            {/* <div className="text-base leading-relaxed [&>p+p]:mt-4">
              {renderRichTextWithBreaks(page.projectScope.json)}
            </div> */}
          </>
        )}
      </div>

      {page.dataOne?.json && (
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left py-6 border-t border-[var(--mesm-grey)]">
          {" "}
          <div className="text-base leading-relaxed h2:text-lg [&>p+p]:mt-4">
            {" "}
            <StaggeredChildren baseDelay={0}>
              {" "}
              {renderRichTextWithBreaks(page.dataOne.json)}{" "}
            </StaggeredChildren>{" "}
          </div>{" "}
          {page.dataTwo?.json && (
            <div className="text-base leading-relaxed [&>p+p]:mt-4">
              {" "}
              <StaggeredChildren baseDelay={0.2}>
                {" "}
                {renderRichTextWithBreaks(page.dataTwo.json)}{" "}
              </StaggeredChildren>{" "}
            </div>
          )}{" "}
          {page.dataThree?.json && (
            <div className="text-base leading-relaxed [&>p+p]:mt-4">
              {" "}
              <StaggeredChildren baseDelay={0.4}>
                {" "}
                {renderRichTextWithBreaks(page.dataThree.json)}{" "}
              </StaggeredChildren>{" "}
            </div>
          )}
        </div>
      )}

      <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left border-t border-[var(--mesm-grey)]"></div>

      <div className="inline-flex col-span-12 items-center gap-2">
        {page.contentfulMetadata?.tags && (
          <ServiceTags
            items={page.contentfulMetadata.tags.map((tag) => tag.name)}
            large={false}
          />
        )}
      </div>

      <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left border-t border-[var(--mesm-grey)]"></div>

      {/* --- EXTENDED DESCRIPTION (right half below) --- */}
      {page.extendedDescription?.json && (
        <div className="col-span-12 lg:col-start-7 lg:col-end-13 min-h-[50vh]">
          <div className="text-base leading-relaxed [&>p+p]:mt-4">
            {richTextParagraphs(page.extendedDescription.json).map((p, i) => (
              <StaggeredWords key={i} as="p" text={p} />
            ))}
          </div>
        </div>
      )}

      {/* --- MEDIA GALLERY --- */}
      <div className="col-span-12 grid grid-cols-12 gap-[var(--global-margin-sm)]">
        {page.mediaGalleryCollection?.items?.map((media, idx, arr) => {
          const mod = idx % 3; // 0 -> full, 1 & 2 -> halves
          const isLast = idx === arr.length - 1;

          // default: full-width
          let colSpan = "col-span-12";

          if (mod !== 0) {
            // half-width on md+, full on mobile
            colSpan = "col-span-12 md:col-span-6";

            // if we end on a single half (mod === 1 and it's the last), make it full
            if (isLast && mod === 1) colSpan = "col-span-12";
          }

          const isVideo = media.url?.includes(".mp4");

          return (
            <div key={idx} className={colSpan}>
              {isVideo ? (
                <video
                  src={media.url}
                  controls
                  className="w-full h-[50vh] object-cover"
                />
              ) : (
                <Image
                  src={media.url}
                  width={media.width}
                  height={media.height}
                  alt={`Gallery media ${idx}`}
                  className="w-full h-[50vh] object-cover hover:opacity-80 transition-opacity"
                />
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
