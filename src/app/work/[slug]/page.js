// "use client";

import { getClient } from "../../../lib/apollo-client";
import { GET_PROJECT_PAGES } from "@/lib/graphql/queries/getProjectPages";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import renderRichTextWithBreaks from "@/lib/renderRichTextWithBreaks";

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
    <main className="grid grid-cols-12 gap-x-[var(--global-margin-sm)] gap-y-[8rem] py-[var(--global-margin-lg)]">
      {/* --- HERO ROW --- */}
      <div className="col-span-12 lg:col-span-8 h-[50vh]">
        <img
          src={page.heroMedia.url}
          alt={page.heroMedia.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="col-span-12 lg:col-span-4 border-1 p-[var(--global-margin-sm)] rounded-lg flex flex-col gap-4">
        <h1 className="font-medium">{page.projectTitle}</h1>
        <p className="text-sm opacity-60">{formattedDate}</p>
        {page.projectScope?.json && (
          <div className="text-base leading-relaxed">
            {renderRichTextWithBreaks(page.projectScope.json)}
          </div>
        )}
      </div>

      {/* --- EXTENDED DESCRIPTION (right half below) --- */}
      {page.extendedDescription?.json && (
        <div className="col-span-12 lg:col-start-7 lg:col-end-13">
          <div className="text-base leading-relaxed">
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
                <img
                  src={media.url}
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
