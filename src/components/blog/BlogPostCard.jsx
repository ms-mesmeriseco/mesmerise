"use client";

import Link from "next/link";
import Image from "next/image";
import BlogServiceTags from "@/components/blog/BlogServiceTags";

export default function BlogPostCard({ post }) {
  if (!post) return null;

  const href = `/blog/${post.slug}`;
  const title = post.postTitle || "Untitled";
  const author = post.blogAuthor;
  const avatarUrl = author?.authorAvatar?.url;

  const authorName = post.blogAuthor?.name;
  const excerpt =
    post.postExcerpt || post.metaDescription?.[0]?.children?.[0]?.text || "";
  console.log("BlogPostCard render:", {
    title,
    avatarUrl,
    author,
    authorName,
    excerpt,
  });

  const formattedDate = post.postDate
    ? new Date(post.postDate).toLocaleString("en-AU", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-md border border-[var(--mesm-grey-dk)] bg-[var(--background)] p-5 transition-colors duration-200 hover:border-[var(--mesm-grey)]"
      aria-label={title}
    >
      {/* Title */}
      <p className="text-md font-bold leading-snug text-[var(--foreground)]">
        {title}
      </p>
      <h5 className="opacity-50">{excerpt}</h5>

      {/* Footer: author + tags */}
      <div className="mt-auto flex flex-col items-left justify-between gap-4 pt-2">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="relative h-7 w-7 shrink-0">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={`Avatar of ${authorName ?? "author"}`}
                fill
                sizes="28px"
                className="rounded-full object-cover ring-1 ring-[var(--mesm-grey-dk)]"
              />
            ) : (
              <div className="h-full w-full rounded-full grid place-items-center bg-[var(--mesm-grey-dk)] text-[var(--foreground)] text-[10px] font-semibold ring-1 ring-[var(--mesm-grey-dk)]">
                {(authorName || "A")
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((s) => s[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
          </div>
          {authorName && (
            <span className="text-sm text-[var(--foreground)]">
              {authorName}
            </span>
          )}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div className="pointer-events-none">
            <BlogServiceTags tags={post.serviceTags} max={2} />
          </div>
          {/* Date */}
          {formattedDate && (
            <h6 className="uppercase text-[var(--mesm-l-grey)] w-[70px] text-center bg-[var(--mesm-grey)]/20">
              {formattedDate}
            </h6>
          )}
        </div>
        {/* Tags */}
      </div>
    </Link>
  );
}
