// "use client";

import { getClient } from "../../../lib/apollo-client";
import { GET_PROJECT_PAGES } from "@/lib/graphql/queries/getProjectPages";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";
import ServiceTags from "@/components/services/ServiceTags";
import Image from "next/image";
import StaggeredChildren from "@/hooks/StaggeredChildren";
import StaggeredWords from "@/hooks/StaggeredWords";
import addClassToParagraphs from "@/lib/utils/addClassToParagraphs";

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
    <main className="grid grid-cols-12 gap-x-[var(--global-margin-sm)] gap-y-[var(--global-margin-sm)] p-[var(--global-margin-md)]">
      {/* --- HERO ROW --- */}
      <div className="col-span-12 md:col-span-12 lg:min-h-[80vh] md:min-h-[50vh] sm:min-h-[30vh] h-[80vh]">
        <Image
          src={page.heroMedia.url}
          alt={page.heroMedia.title}
          width={page.heroMedia.width}
          height={page.heroMedia.height}
          className="w-full h-full object-cover"
        />
      </div>

      {page.dataOne?.json && (
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-2 text-left pt-4 border-t border-[var(--mesm-grey)] h-full">
          {" "}
          <div className="text-base leading-relaxed h2:text-lg [&>p+p]:mt-4 border-1 border-[var(--mesm-grey-dk)] p-4 rounded-md">
            {" "}
            <StaggeredChildren baseDelay={0} once={true}>
              {" "}
              {addClassToParagraphs(
                renderRichTextWithBreaks(page.dataOne.json),
                "page-title-large", // class to add
                "h2"
              )}
            </StaggeredChildren>{" "}
          </div>{" "}
          {page.dataTwo?.json && (
            <div className="text-base leading-relaxed [&>p+p]:mt-4 border-1 border-[var(--mesm-grey-dk)] p-4 rounded-md">
              {" "}
              <StaggeredChildren baseDelay={0.2} once={true}>
                {" "}
                {addClassToParagraphs(
                  renderRichTextWithBreaks(page.dataTwo.json),
                  "page-title-large", // class to add
                  "h2"
                )}
              </StaggeredChildren>{" "}
            </div>
          )}{" "}
          {page.dataThree?.json && (
            <div className="text-base leading-relaxed [&>p+p]:mt-4 border-1 border-[var(--mesm-grey-dk)] p-4 rounded-md">
              {" "}
              <StaggeredChildren baseDelay={0.4} once={true}>
                {" "}
                {addClassToParagraphs(
                  renderRichTextWithBreaks(page.dataThree.json),
                  "page-title-large", // class to add
                  "h2"
                )}
              </StaggeredChildren>{" "}
            </div>
          )}
        </div>
      )}

      <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left border-t border-[var(--mesm-grey)]"></div>
      <div className="col-span-12 lg:col-span-6  rounded-lg flex flex-col gap-2  md:max-w-[475px]">
        <h1 className="font-medium">{page.projectTitle}</h1>
        <h6 className="opacity-40">{formattedDate}</h6>
        <h6 className="opacity-40">{page.collaborationModel || ""}</h6>

        {page.projectScope?.json && (
          <>
            <StaggeredWords
              as="h6"
              text="Project scope"
              className="opacity-60"
            />

            <div className="text-base leading-relaxed [&>p+p]:mt-4">
              {addClassToParagraphs(
                renderRichTextWithBreaks(page.projectScope.json),
                "p4"
              )}
            </div>
          </>
        )}
      </div>

      <div className="inline-flex col-span-12 gap-2 pt-6">
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
        <div className="col-span-12 min-h-[50vh] border-b border-[var(--mesm-grey)] py-8">
          {/* <div className="text-base leading-relaxed [&>p+p]:mt-4">
            {richTextParagraphs(page.extendedDescription.json).map((p, i) => (
              <StaggeredWords key={i} as="p" text={p} />
            ))}
          </div> */}

          <div className="text-base md:w-1/2 ml-auto w-full leading-relaxed [&>p+p]:mt-4  ">
            <div className="max-w-[475px]">
              {addClassToParagraphs(
                renderRichTextWithBreaks(page.extendedDescription.json),
                "p2"
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MEDIA GALLERY --- */}
      <div className="col-span-12 grid grid-cols-12 gap-[var(--global-margin-sm)] pt-4">
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
