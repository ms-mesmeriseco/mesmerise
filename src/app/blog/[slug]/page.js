import { draftMode } from "next/headers";
import { getClient } from "@/lib/apollo-client";
import { GET_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";
import { GET_ADJACENT_AND_RELATED_BLOGS } from "@/lib/graphql/queries/getBlogPosts";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";
import BlogTOC from "@/components/blog/BlogTOC";
import Image from "next/image";
import StaggeredWords from "@/hooks/StaggeredWords";
import Link from "next/link";
import BlogRail from "@/components/cms-blocks/BlogRail";

function abs(url) {
  if (!url) return undefined;
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "";
    return url.startsWith("http") ? url : `${base}${url}`;
  } catch {
    return url;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params || {};
  if (!slug) return {};

  const { isEnabled } = await draftMode();
  const client = getClient({ preview: isEnabled });

  const { data } = await client.query({
    query: GET_BLOG_POSTS,
    variables: { slug, preview: isEnabled }, // 👈 pass preview
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
    page.metaDescription?.json ||
    (page.blogContent?.json?.content || [])
      .map((n) =>
        n.nodeType === "paragraph"
          ? (n.content || []).map((c) => c.value || "").join("")
          : ""
      )
      .join(" ")
      .slice(0, 160);

  const ogImage =
    page.heroImage?.url ||
    "https://www.mesmeriseco.com/assets/social-default.png";

  const canonical = abs(`https://www.mesmeriseco.com/blog/${slug}`);

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
  };
}

function AuthorCard({ author }) {
  if (!author) return null;
  const avatar = author.authorAvatar;

  return (
    <section
      className="mt-12 border-1 border-[var(--mesm-grey-dk)] p-6 rounded-md flex gap-4"
      itemScope
      itemType="https://schema.org/Person"
    >
      {avatar?.url && (
        <Image
          src={avatar.url}
          alt={`Avatar of ${author.name ?? "author"}`}
          width={Math.min(avatar.width ?? 96, 128)}
          height={Math.min(avatar.height ?? 96, 128)}
          className="rounded-full shrink-0"
        />
      )}

      <div className="flex-1">
        {author?.name && (
          <h3 className="" itemProp="name">
            {author.name}
          </h3>
        )}
        {author?.authorBio?.json && (
          <div className="prose max-w-none text-[var(--foreground)]">
            {renderRichTextWithBreaks(author.authorBio.json)}
          </div>
        )}
      </div>
    </section>
  );
}

export default async function BlogPost({ params }) {
  const { slug } = params;
  const { isEnabled } = await draftMode(); // 👈 detect Draft Mode
  const client = getClient({ preview: isEnabled }); // 👈 preview-aware client

  const { data } = await client.query({
    query: GET_BLOG_POSTS,
    variables: { slug, preview: isEnabled }, // 👈 pass preview through
  });

  const page = data?.blogPostPageCollection?.items?.[0];
  if (!page) return <p>Blog post not found.</p>;
  const tagIds =
    page?.contentfulMetadata?.tags?.map((t) => t?.id).filter(Boolean) || [];

  const { data: more } = await client.query({
    query: GET_ADJACENT_AND_RELATED_BLOGS,
    variables: {
      date: page.postDate || new Date(0).toISOString(),
      slug,
      tagIds: tagIds.length ? tagIds : undefined,
      preview: isEnabled,
    },
    fetchPolicy: "no-cache",
  });

  const prev = more?.prev?.items?.[0] || null;
  const next = more?.next?.items?.[0] || null;
  const related = (more?.related?.items || []).filter(
    (r) => r?.slug && r?.slug !== slug
  );

  const author = page.blogAuthor;
  const avatar = author?.authorAvatar;

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
    <>
      <div className="flex flex-col items-center min-h-screen gap-0">
        <main className="flex flex-col md:flex-row md:gap-6 w-full mx-auto">
          {h3Anchors.length > 0 && (
            <aside
              className={[
                "hidden md:block",
                "md:self-start md:shrink-0 md:w-64",
                "md:sticky",
                "md:top-[calc(var(--header-height,64px)+32px)]",
                "md:max-h-[calc(100vh-var(--header-height,64px)-32px)] md:overflow-auto",
                "z-20",
              ].join(" ")}
            >
              <BlogTOC anchors={h3Anchors} />
            </aside>
          )}

          <article className="max-w-xl w-full flex flex-col gap-6 md:pt-7">
            <StaggeredWords
              as="h1"
              className="page-title-medium"
              text={page.postHeading}
            />
            <span className="text-sm text-[var(--mesm-l-grey)] flex flex-row gap-4 items-start md:py-8 py-2">
              {avatar?.url && (
                <Image
                  src={avatar.url}
                  alt={`Avatar of ${author?.name ?? "author"}`}
                  width={Math.min(avatar.width ?? 48, 96)}
                  height={Math.min(avatar.height ?? 48, 96)}
                  className="rounded-full shrink-0"
                />
              )}
              <span>
                {formattedDate && (
                  <>
                    {formattedDate}
                    <br />
                  </>
                )}
                {author?.name ? <>By {author.name}</> : null}
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

            {author?.authorBio && <AuthorCard author={author} />}
            {/* Prev / Next */}
            {(prev || next) && (
              <nav
                className="mt-8 pt-6 border-t border-[var(--mesm-grey-dk)] flex items-center justify-between gap-3"
                aria-label="Blog pagination"
              >
                <div className="min-w-0">
                  {prev ? (
                    <Link
                      href={`/blog/${prev.slug}`}
                      className="group inline-flex items-center gap-2 text-sm"
                    >
                      <span className="opacity-70">Previous article</span>
                      {/* <span className="truncate group-hover:underline">
                      {prev.postTitle}
                    </span> */}
                    </Link>
                  ) : (
                    <span className="opacity-40 text-sm">No previous post</span>
                  )}
                </div>
                <div className="min-w-0 text-right">
                  {next ? (
                    <Link
                      href={`/blog/${next.slug}`}
                      className="group inline-flex items-center gap-2 text-sm"
                    >
                      {/* <span className="truncate group-hover:underline">
                      {next.postTitle}
                    </span> */}
                      <span className="opacity-70">Next article</span>
                    </Link>
                  ) : (
                    <span className="opacity-40 text-sm">No next post</span>
                  )}
                </div>
              </nav>
            )}
          </article>
        </main>
      </div>
      <h6 className="pt-24">Learn more</h6>
      <div className="py-4 border-y border-[var(--mesm-grey-dk)]">
        <BlogRail />
      </div>
    </>
  );
}
