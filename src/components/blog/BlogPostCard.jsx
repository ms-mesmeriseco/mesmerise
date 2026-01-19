"use client";

import Link from "next/link";
import Image from "next/image";
import BlogServiceTags from "@/components/blog/BlogServiceTags";

export default function BlogPostCard({ post }) {
  if (!post) return null;

  const href = `/blog/${post.slug}`;
  const title = post.postTitle || "Untitled";
  const img = post.heroImage?.url;

  return (
    <Link href={href} className="group block w-full" aria-label={title}>
      {/* Image */}
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md border border-[var(--mesm-grey-dk)]">
        {img ? (
          <Image
            src={img}
            alt={post.heroImage?.alt || title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 md:group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs opacity-70">
            No image
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="pt-2 opacity-60 hover:opacity-100 transition-opacity duration-200">
        <h5
          className="
            text-md font-bold leading-tight
            text-[var(--foreground)]
         
            transition-colors duration-200
            p-1
          "
        >
          {title}
        </h5>

        {/* Tags (display-only) */}
        <div className="pointer-events-none mt-1">
          <BlogServiceTags tags={post.serviceTags} />
        </div>
      </div>
    </Link>
  );
}
