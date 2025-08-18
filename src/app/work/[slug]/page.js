// "use client";

import { getClient } from "../../../lib/apollo-client";
import { GET_PROJECT_PAGES } from "@/lib/graphql/queries/getProjectPages";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";
import ServiceTags from "@/components/services/ServiceTags";
import Image from "next/image";

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const { data } = await getClient().query({ query: GET_PROJECT_PAGES });
  const page = data.projectPageCollection.items.find(
    (post) => post.slug === slug
  );
  const formattedDate = new Date(page.projectDate).toLocaleString("en-AU", {
    year: "numeric",
  });

  if (!page) return <p>Blog post not found.</p>;

  return (
    <main className="grid grid-cols-12 gap-x-[var(--global-margin-sm)] gap-y-[var(--global-margin-sm)] p-[var(--global-margin-lg)]">
      {/* --- HERO ROW --- */}
      <div className="col-span-12 lg:col-span-8 lg:h-[80vh]  md:h-[50vh] sm:h-[30vh] ">
        <Image
          src={page.heroMedia.url}
          alt={page.heroMedia.title}
          width={page.heroMedia.width}
          height={page.heroMedia.height}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="col-span-12 lg:col-span-4 border-1 border-[var(--mesm-grey-dk)] p-[var(--global-margin-sm)] rounded-lg flex flex-col gap-4">
        <h1 className="font-medium">{page.projectTitle}</h1>
        <h6 className="opacity-40">{formattedDate}</h6>
        <h6 className="opacity-40">{page.collaborationModel || ""}</h6>

        {page.projectScope?.json && (
          <>
            <h6 className="opacity-40">PROJECT SCOPE</h6>
            <div className="text-base leading-relaxed [&>p+p]:mt-4">
              {renderRichTextWithBreaks(page.projectScope.json)}
            </div>
          </>
        )}
      </div>

      {page.dataOne?.json && (
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left py-6 border-t border-[var(--mesm-grey)]">
          <div className="text-base leading-relaxed h2:text-lg [&>p+p]:mt-4">
            {renderRichTextWithBreaks(page.dataOne.json)}
          </div>
          {page.dataTwo?.json && (
            <div className="text-base leading-relaxed [&>p+p]:mt-4">
              {renderRichTextWithBreaks(page.dataTwo.json)}
            </div>
          )}
          {page.dataThree?.json && (
            <div className="text-base leading-relaxed [&>p+p]:mt-4">
              {renderRichTextWithBreaks(page.dataThree.json)}
            </div>
          )}
        </div>
      )}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left border-t border-[var(--mesm-grey)]"></div>
      <div className="inline-flex col-span-12 items-center gap-2">
        {page.contentfulMetadata?.tags && (
          <ServiceTags
            items={page.contentfulMetadata.tags.map((tag) => tag.name)}
          />
        )}
      </div>
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left border-t border-[var(--mesm-grey)]"></div>
      {/* --- EXTENDED DESCRIPTION (right half below) --- */}
      {page.extendedDescription?.json && (
        <div className="col-span-12 lg:col-start-7 lg:col-end-13">
          <div className="text-base leading-relaxed [&>p+p]:mt-4">
            {renderRichTextWithBreaks(page.extendedDescription.json)}
          </div>
        </div>
      )}

      {/* --- MEDIA GALLERY --- */}
      <div className="col-span-12 grid grid-cols-12 gap-[var(--global-margin-sm)]">
        {page.mediaGalleryCollection?.items?.map((media, idx) => {
          const isEven = idx % 2 === 0;
          const colSpan = isEven ? "col-span-12" : "col-span-6";

          return (
            <div key={idx} className={`${colSpan}`}>
              {media.url.includes(".mp4") ? (
                <video
                  src={media.url}
                  controls
                  className="w-full  h-[100vh] rounded-lg"
                />
              ) : (
                <Image
                  src={media.url}
                  width={media.width}
                  height={media.height}
                  alt={`Gallery media ${idx}`}
                  className="w-full  h-[50vh] rounded-lg object-cover hover:opacity-80 transition-opacity"
                />
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
