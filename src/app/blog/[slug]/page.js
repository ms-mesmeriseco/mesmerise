import { getClient } from "@/lib/apollo-client";
import { GET_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";
import BlogTOC from "@/components/blog/BlogTOC";
import Image from "next/image";

function abs(url) {
  if (!url) return undefined;
  try {
    // prefer env, fallback to request-less relative (Next will handle)
    const base = process.env.NEXT_PUBLIC_SITE_URL || "";
    return url.startsWith("http") ? url : `${base}${url}`;
  } catch {
    return url;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params || {};
  if (!slug) return {};

  const { data } = await getClient().query({
    query: GET_BLOG_POSTS,
    variables: { slug },
  });

  const page = data?.blogPostPageCollection?.items?.[0];
  if (!page) {
    return {
      title: "Post not found",
      description: "This post could not be located.",
      robots: { index: false },
    };
  }

  const metaTitle = page.metaTitle || page.postTitle || "Mesmerise Digital";

  const metaDescription =
    page.metaDescription ||
    // quick fallback from first paragraph if needed
    (page.blogContent?.json?.content || [])
      .map((n) =>
        n.nodeType === "paragraph"
          ? (n.content || []).map((c) => c.value || "").join("")
          : ""
      )
      .join(" ")
      .slice(0, 160);

  const ogImage =
    page.heroImage?.url || "https://mesmeriseco.com/assets/social-default.png";

  const canonical = abs(`/blog/${slug}`);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonical,
      type: "article",
      images: ogImage ? [{ url: abs(ogImage) }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [abs(ogImage)] : undefined,
    },
  };
}

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
      })
    : "";

  return (
    <div className="flex flex-col items-center /* remove justify-center */ min-h-screen gap-0">
      <main className="flex flex-col md:flex-row md:gap-8 w-full mx-auto px-4 pt-18">
        {h3Anchors.length > 0 && (
          <aside
            className={[
              "hidden md:block",
              "md:self-start md:shrink-0 md:w-64",
              "md:sticky",
              // Fallback if --header-height is missing; 64px ≈ 4rem header
              "md:top-[calc(var(--header-height,64px)+32px)]",
              // don't force a fixed height; instead cap it and let the TOC scroll if long
              "md:max-h-[calc(100vh-var(--header-height,64px)-32px)] md:overflow-auto",
              "z-20",
            ].join(" ")}
          >
            <BlogTOC anchors={h3Anchors} />
          </aside>
        )}

        <article className="max-w-xl w-full flex flex-col gap-6">
          <h1 className="text-sm">{page.postHeading}</h1>
          <span className="text-sm text-[var(--mesm-l-grey)] flex flex-row gap-4 items-start ">
            {page.authorAvatar && (
              <Image
                src={page.authorAvatar.url}
                alt={page.authorAvatar.title || "Author avatar"}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}

            <span>
              {formattedDate && (
                <>
                  {formattedDate}
                  <br />
                </>
              )}
              By {page.postAuthor}
            </span>
          </span>

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
