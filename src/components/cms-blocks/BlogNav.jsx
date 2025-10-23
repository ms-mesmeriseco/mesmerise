"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getClient } from "@/lib/apollo-client";
import { GET_ALL_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";

export default function BlogScroll() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0); // current "page" index (0 = first)
  const pageSize = 6;

  const totalPages = Math.ceil(posts.length / pageSize);
  const atStart = page === 0;
  const atEnd = page >= totalPages - 1;

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const { data } = await getClient().query({ query: GET_ALL_BLOG_POSTS });
        setPosts(data?.blogPostPageCollection?.items || []);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      }
    }
    fetchBlogPosts();
  }, []);

  const visiblePosts = posts.slice(page * pageSize, (page + 1) * pageSize);

  function goPrev() {
    if (!atStart) setPage((p) => p - 1);
  }

  function goNext() {
    if (!atEnd) setPage((p) => p + 1);
  }

  return (
    <section className="w-full">
      {/* Grid of posts */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 transition-all duration-300">
        {visiblePosts.map((post, index) => (
          <Link
            key={`blog-${post.slug}-${index}`}
            href={`/blog/${post.slug}`}
            className="relative group w-full aspect-[6/4] rounded-md overflow-hidden border border-[var(--mesm-grey-dk)] hover:bg-[var(--mesm-grey)] hover:text-[var(--background)] duration-200"
          >
            {/* Image */}
            {post.heroImage?.url && (
              <Image
                src={post.heroImage.url}
                alt={post.heroImage.title || "Blog image"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Text */}
            <div className="absolute bottom-[var(--global-margin-sm)] left-[var(--global-margin-sm)] text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <h5 className="text-sm font-bold text-white">{post.postTitle}</h5>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Dots */}
      {posts.length > pageSize && (
        <div className="mt-2 w-full flex justify-end">
          <div className="flex items-center gap-2 py-2">
            <button
              type="button"
              aria-label="Previous page"
              onClick={goPrev}
              disabled={atStart}
              className={`h-6 w-6 rounded-full border border-[var(--mesm-yellow)] bg-[var(--mesm-yellow)] ${
                atStart
                  ? "opacity-40 cursor-default bg-transparent"
                  : "bg-[var(--mesm-yellow)] hover:bg-transparent duration-200 cursor-pointer"
              }`}
            />
            <button
              type="button"
              aria-label="Next page"
              onClick={goNext}
              disabled={atEnd}
              className={`h-6 w-6 rounded-full border border-[var(--mesm-yellow)] bg-[var(--mesm-yellow)] ${
                atEnd
                  ? "opacity-40 cursor-default bg-transparent"
                  : "bg-[var(--mesm-yellow)] hover:bg-transparent duration-200 cursor-pointer"
              }`}
            />
          </div>
        </div>
      )}
    </section>
  );
}
