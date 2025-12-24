import React from "react";
import { draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import ListCard from "@/components/ui/ListCard";
import ExpandingCard from "@/components/ui/ExpandingCard";
import BlogTOC from "@/components/blog/BlogTOC";
import StaggeredWords from "@/hooks/StaggeredWords";
import BlogRail from "@/components/sanity-blocks/BlogRail";

import { sanityClient } from "@/sanity/client";
import { blogPostBySlugQuery, adjacentBlogPostsQuery } from "@/lib/sanity/blog";

// --- helpers ---
function abs(url) {
  if (!url) return undefined;
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "";
    return url.startsWith("http") ? url : `${base}${url}`;
  } catch {
    return url;
  }
}

// Simple slugify helper for heading IDs / TOC
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

// Convert Portable Text blocks → plain text for meta description
function blocksToPlainText(blocks, maxChars) {
  if (!Array.isArray(blocks)) return "";
  const text = blocks
    .filter((b) => b._type === "block")
    .map((b) => (b.children || []).map((c) => c.text || "").join(""))
    .join(" ")
    .trim();

  return maxChars ? text.slice(0, maxChars) : text;
}

// Build TOC anchors from Sanity Portable Text (h3 blocks)
function getH3AnchorsFromPortableText(blocks) {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((block) => block._type === "block" && block.style === "h3")
    .map((block, idx) => {
      const text =
        (block.children || [])
          .map((c) => c.text || "")
          .join("")
          .trim() || `Section ${idx + 1}`;
      const id = slugify(text);
      return { text, id };
    });
}

// Normalize PT keys so there are no duplicates (migration sometimes creates dupes)
function normalizePortableTextKeys(value) {
  if (!Array.isArray(value)) return value;
  const seen = new Set();

  const fixNode = (node) => {
    if (!node || typeof node !== "object") return node;
    const copy = { ...node };

    if (copy._key) {
      const base = String(copy._key);
      let newKey = base;
      let i = 1;
      while (seen.has(newKey)) {
        newKey = `${base}-${i++}`;
      }
      copy._key = newKey;
      seen.add(newKey);
    }

    for (const prop of Object.keys(copy)) {
      const v = copy[prop];
      if (Array.isArray(v)) {
        copy[prop] = v.map(fixNode);
      }
    }

    return copy;
  };

  return value.map(fixNode);
}

// PortableText components for blog / FAQ / author bio
const blogPortableComponents = {
  block: {
    normal: ({ children }) => (
      <p className="leading-relaxed mb-4 last:mb-0">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-2xl font-semibold">{children}</h2>
    ),
    h3: ({ children, value }) => {
      const text =
        (value?.children || [])
          .map((c) => c.text || "")
          .join("")
          .trim() || "";
      const id = slugify(text || "section");
      return (
        <h3
          id={id}
          className="text-xl font-600 scroll-mt-[120px] [&>a]:text-[var(--mesm-blue)]"
        >
          {children}
        </h3>
      );
    },
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 text-lg font-semibold">{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 space-y-1 mb-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-1 mb-4">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => (
      <span className="underline underline-offset-2">{children}</span>
    ),

    link: ({ children, value }) => {
      const href = value?.href || "#";
      const target = value?.target || "_self";
      const rel = target === "_blank" ? "noopener noreferrer" : undefined;

      const isInternal = href.startsWith("/") || href.startsWith("#");

      const content = <span className="">{children}</span>;

      // Internal → use next/link
      if (isInternal) {
        return <Link href={href}>{content}</Link>;
      }

      // External → plain <a>
      return (
        <a href={href} target={target} rel={rel}>
          {content}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const url = value?.asset?.url;
      if (!url) return null;
      const alt = value.alt || "";
      return (
        <figure className="my-6">
          {/* Using plain img here to avoid width/height requirements */}
          <img src={url} alt={alt} className="w-full h-auto rounded-md" />
        </figure>
      );
    },
    file: ({ value }) => {
      const href = value?.file?.url;
      if (!href) return null;
      return (
        <video
          controls
          autoPlay
          muted
          className="rounded-md"
          src={href}
        ></video>
      );
    },
    break: ({ value }) => {
      if (value?.style === "readMore") {
        return (
          <div className="my-8 py-4 border-y border-[var(--mesm-grey-dk)] text-center text-sm uppercase tracking-wide">
            Read more
          </div>
        );
      }
      return <hr className="my-8 border-[var(--mesm-grey-dk)]" />;
    },

    accordionItem: ({ value }) => {
      if (!value) return null;

      return (
        <div className="">
          <ExpandingCard
            title={value.entryTitle || "TL;DR"}
            defaultExpanded={false}
          >
            <PortableText
              value={value.textContent || []}
              components={blogPortableComponents}
            />
          </ExpandingCard>
        </div>
      );
    },

    listIconItem: ({ value }) => {
      if (!value) return null;
      return (
        <div className="my-6">
          <ListCard icon={value.iconUrl} entryTitle={value.entryTitle}>
            <PortableText
              value={value.textContent || []}
              components={blogPortableComponents}
            />
          </ListCard>
        </div>
      );
    },
  },
};

// --- Metadata from Sanity ---
export async function generateMetadata({ params }) {
  const resolved = await params;
  const { slug } = resolved || {};
  if (!slug) return {};

  await draftMode().catch(() => null);

  let page;
  try {
    page = await sanityClient.fetch(blogPostBySlugQuery, { slug });
  } catch (err) {
    console.error("Sanity blog generateMetadata error:", err);
  }

  if (!page) {
    return {
      title: "Post not found",
      description: "This post could not be located.",
      robots: { index: false },
    };
  }

  const normMetaDesc = normalizePortableTextKeys(page.metaDescription);
  const normBlogContent = normalizePortableTextKeys(page.blogContent);

  const metaTitle = page.metaTitle || page.postTitle || "Mesmerise Digital";

  const metaDescription =
    blocksToPlainText(normMetaDesc, 160) ||
    blocksToPlainText(normBlogContent, 160) ||
    "Insights from Mesmerise Digital.";

  const ogImage = page.heroImage?.url
    ? abs(page.heroImage.url)
    : "https://www.mesmeriseco.com/assets/social-default.png";

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
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

// --- Author card wired to Sanity ---
function AuthorCard({ author }) {
  if (!author) return null;
  const avatarUrl = author.authorAvatar?.url;
  const authorBio = normalizePortableTextKeys(author.authorBio);

  return (
    <section
      className="mt-12 border-1 border-[var(--mesm-grey-dk)] p-6 rounded-md flex gap-4"
      itemScope
      itemType="https://schema.org/Person"
    >
      {avatarUrl && (
        <Image
          src={avatarUrl}
          alt={`Avatar of ${author.name ?? "author"}`}
          width={96}
          height={96}
          className="rounded-full shrink-0"
        />
      )}

      <div className="flex-1">
        {author?.name && (
          <h3 className="" itemProp="name">
            {author.name}
          </h3>
        )}
        {authorBio && (
          <div className="prose max-w-none text-[var(--foreground)]">
            <PortableText
              value={authorBio}
              components={blogPortableComponents}
            />
          </div>
        )}
      </div>
    </section>
  );
}

// --- Main blog page (Sanity) ---
export default async function BlogPost({ params }) {
  const resolved = await params;
  const { slug } = resolved || {};
  if (!slug) return <p>Blog post not found.</p>;

  let page;
  let more;

  try {
    page = await sanityClient.fetch(blogPostBySlugQuery, { slug });
    if (!page) return <p>Blog post not found.</p>;

    more = await sanityClient.fetch(adjacentBlogPostsQuery, {
      slug,
      date: page.postDate || new Date(0).toISOString(),
    });
    // 👇 TEMP LOGGING
    // console.log("BLOG CONTENT RAW:", JSON.stringify(page.blogContent, null, 2));
    // console.log(
    //   "FIRST BLOCK MARKDEFS:",
    //   JSON.stringify(page.blogContent?.[0]?.markDefs, null, 2)
    // );
  } catch (err) {
    console.error("BlogPost Sanity error:", err);
    return <p>Blog post not found.</p>;
  }

  const prev = more?.prev || null;
  const next = more?.next || null;

  const author = page.blogAuthor;
  const avatarUrl = author?.authorAvatar?.url;

  const normBlogContent = normalizePortableTextKeys(page.blogContent);
  const normFaqContent = normalizePortableTextKeys(page.faqContent);

  const h3Anchors = getH3AnchorsFromPortableText(normBlogContent);

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

          <article className="max-w-3xl w-full flex flex-col gap-6 md:pt-7">
            <StaggeredWords
              as="h1"
              className="page-title-medium"
              text={page.postHeading || page.postTitle}
            />

            <span className="text-sm text-[var(--mesm-l-grey)] flex flex-row gap-4 items-start md:py-8 py-2">
              {avatarUrl && (
                <Image
                  src={avatarUrl}
                  alt={`Avatar of ${author?.name ?? "author"}`}
                  width={72}
                  height={72}
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

            {/* Blog Content – Portable Text */}
            {normBlogContent && (
              <div className="flex flex-col gap-4">
                <PortableText
                  value={normBlogContent}
                  components={blogPortableComponents}
                />
              </div>
            )}

            {/* FAQ Content – Portable Text */}
            {normFaqContent && normFaqContent.length > 0 && (
              <div className="mt-10 flex flex-col gap-4">
                <PortableText
                  value={normFaqContent}
                  components={blogPortableComponents}
                />
              </div>
            )}

            {author?.authorBio && <AuthorCard author={author} />}

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
        {/* BlogRail is still Contentful for now – we can Sanity-fy this next */}
        <BlogRail />
      </div>
    </>
  );
}
