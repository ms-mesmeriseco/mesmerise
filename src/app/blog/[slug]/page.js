import { getClient } from "@/lib/apollo-client";
import { GET_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";
import BlogTOC from "@/components/blog/BlogTOC";

export default async function BlogPost({ params }) {
  const { slug } = params;

  const { data } = await getClient().query({
    query: GET_BLOG_POSTS,
    variables: { slug },
  });

  const page = data?.blogPostPageCollection?.items?.[0];
  if (!page) return <p>Blog post not found.</p>;

  // ---- maps ----
  const assetBlocks = page.blogContent?.links?.assets?.block ?? [];
  const assetHyperlinks = page.blogContent?.links?.assets?.hyperlink ?? [];
  const assetMap = Object.fromEntries(
    [...assetBlocks, ...assetHyperlinks].map((a) => [a.sys.id, a])
  );

  const collectEntries = (rich) => ({
    block: rich?.links?.entries?.block ?? [],
    inline: rich?.links?.entries?.inline ?? [],
    hyperlink: rich?.links?.entries?.hyperlink ?? [],
  });

  const blogEntries = collectEntries(page.blogContent);
  const faqEntries = collectEntries(page.faqContent);

  const entryMap = Object.fromEntries(
    [
      ...blogEntries.block,
      ...blogEntries.inline,
      ...blogEntries.hyperlink,
      ...faqEntries.block,
      ...faqEntries.inline,
      ...faqEntries.hyperlink,
    ].map((e) => [e.sys.id, e])
  );

  // ---- TOC anchors from H3 ----
  const getH3Anchors = (json) => {
    const anchors = [];
    if (!json?.content) return anchors;
    json.content.forEach((node, idx) => {
      if (node.nodeType === "heading-3") {
        const text =
          (node.content ?? [])
            .map((c) => c?.value || "")
            .join("")
            .trim() || `Section ${idx}`;
        const id = text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
        anchors.push({ text, id });
      }
    });
    return anchors;
  };

  const h3Anchors = getH3Anchors(page.blogContent?.json);

  const formattedDate = page.postDate
    ? new Date(page.postDate).toLocaleString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-0">
      {/* Optional Hero
      <div className="w-full aspect-[16/5] rounded-4xl h-[60vh] overflow-hidden mb-0 p-[var(--global-margin-sm)]">
        <img
          src={page.heroImage?.url || ""}
          alt={page.heroImage?.title || ""}
          className="w-full h-full object-cover rounded-3xl"
        />
      </div> */}

      <main className="flex flex-col md:flex-row md:gap-8 gap-0 rounded-3xl w-full mx-auto px-4 pt-18">
        {h3Anchors.length > 0 && (
          <aside
            className="
              hidden md:block
              md:sticky
              md:top-[calc(var(--header-height)+16px)]
              md:h-[calc(100vh-var(--header-height)-32px)]
              md:w-64
              self-start
              z-20
            "
          >
            <BlogTOC anchors={h3Anchors} />
          </aside>
        )}

        <article className="max-w-xl w-full flex flex-col gap-2">
          <h1 className="text-sm">{page.postHeading}</h1>
          <span className="text-sm text-[var(--mesm-l-grey)]">
            {formattedDate && (
              <>
                {formattedDate}
                <br />
              </>
            )}
            By {page.postAuthor}
          </span>

          <br />

          {page.blogContent?.json && (
            <div className="[&>p+p]:mt-4 flex flex-col gap-4">
              {renderRichTextWithBreaks(page.blogContent.json, assetMap, {
                blog: true,
                entryMap,
              })}
            </div>
          )}

          {page.faqContent?.json && (
            <div className="[&>p+p]:mt-4 flex flex-col gap-4">
              {renderRichTextWithBreaks(page.faqContent.json, assetMap, {
                blog: true,
                entryMap,
              })}
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
