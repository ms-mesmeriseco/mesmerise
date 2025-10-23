"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getClient } from "@/lib/apollo-client";
import { GET_ALL_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";

export default function BlogScroll() {
  const [posts, setPosts] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [page, setPage] = useState(0);
  const pageSize = 6;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getClient().query({ query: GET_ALL_BLOG_POSTS });
        const items = data?.blogPostPageCollection?.items || [];

        // Normalize and filter out "showBlogInFooter"
        const normalized = items.map((p) => {
          const tags =
            p?.contentfulMetadata?.tags
              ?.filter(
                (t) =>
                  t?.name?.toLowerCase() !== "showbloginfooter" &&
                  t?.id?.toLowerCase() !== "showbloginfooter"
              )
              ?.map((t) => ({
                id: t?.id,
                name: t?.name || t?.id,
              })) || [];
          return { ...p, _tags: tags };
        });

        const normalizedSorted = normalized.sort((a, b) => {
          const da = a.postDate ? new Date(a.postDate).getTime() : 0;
          const db = b.postDate ? new Date(b.postDate).getTime() : 0;
          return db - da; // DESC
        });

        setPosts(normalizedSorted);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      }
    })();
  }, []);

  // Filtered list based on selected tag
  const filtered = useMemo(() => {
    if (!selectedTagId) return posts;
    return posts.filter((p) => p._tags?.some((t) => t.id === selectedTagId));
  }, [posts, selectedTagId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const atStart = page === 0;
  const atEnd = page >= totalPages - 1;

  useEffect(() => {
    if (page > totalPages - 1) setPage(0);
  }, [totalPages, page]);

  const visiblePosts = filtered.slice(page * pageSize, (page + 1) * pageSize);

  function goPrev() {
    if (!atStart) setPage((p) => p - 1);
  }
  function goNext() {
    if (!atEnd) setPage((p) => p + 1);
  }
  function onTagClick(tagId) {
    setSelectedTagId((curr) => (curr === tagId ? null : tagId)); // toggle
    setPage(0);
  }

  return (
    <section className="w-full">
      {/* Active filter label */}
      {selectedTagId && (
        <div className="mb-2 flex items-center gap-2 text-xs">
          <span className="opacity-70">Filtering by:</span>
          <button
            className="px-2 py-1 rounded-full hover:bg-[var(--mesm-yellow)] bg-[var(--mesm-grey)] rounded-md text-[var(--background)]"
            onClick={() => onTagClick(selectedTagId)}
          >
            {(() => {
              const first = posts
                .flatMap((p) => p._tags || [])
                .find((t) => t.id === selectedTagId);
              return (first?.name || selectedTagId) + " ✕";
            })()}
          </button>
        </div>
      )}

      {/* Grid of posts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 transition-all duration-300">
        {visiblePosts.map((post) => (
          <Link
            key={`blog-${post.slug}`}
            href={`/blog/${post.slug}`}
            className="relative group w-full rounded-md overflow-hidden hover:text-[var(--background)] duration-200"
          >
            {/* Make the card flex vertically: image then text */}
            <div className="flex flex-col h-full">
              {/* Image */}
              <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden border border-[var(--mesm-grey-dk)]">
                {post.heroImage?.url && (
                  <Image
                    src={post.heroImage.url}
                    alt={post.heroImage.title || "Blog image"}
                    fill
                    className="object-cover transition-transform duration-300 md:group-hover:scale-105"
                    sizes="(min-width: 768px) 33vw, 100vw"
                    priority={false}
                  />
                )}
              </div>

              {/* Content (always visible; hover effects only on md+) */}
              <div className="py-2">
                <h5
                  className={[
                    "text-sm font-bold duration-200",
                    // always visible, bright text on mobile
                    "text-[var(--foreground)]",
                    // only desktop hover states
                    "md:text-[var(--mesm-grey)] md:group-hover:text-[var(--foreground)]",
                  ].join(" ")}
                >
                  {post.postTitle}
                </h5>

                {!!post._tags?.length && (
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    {post._tags.map((tag) => (
                      <button
                        key={`${post.slug}-tag-${tag.id}`}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onTagClick(tag.id);
                        }}
                        className={[
                          "rounded-lg px-3 py-1 text-sm font-normal whitespace-nowrap cursor-pointer transition duration-200",
                          "bg-[var(--mesm-grey)]/10 border border-[var(--mesm-grey-dk)]",
                          // text stays foreground on mobile
                          "text-[var(--foreground)]",
                          // only desktop hover states
                          "md:text-[var(--mesm-grey-dk)] md:group-hover:text-[var(--foreground)]",
                          "hover:bg-[var(--mesm-red)] hover:border-[var(--mesm-red)] hover:text-[var(--background)]",
                          selectedTagId === tag.id
                            ? "bg-[var(--mesm-yellow)]/20"
                            : "",
                        ].join(" ")}
                        aria-pressed={selectedTagId === tag.id}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation dots */}
      {filtered.length > pageSize && (
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
