"use client";

import { useEffect, useMemo, useState } from "react";

import { sanityClient } from "@/sanity/client";
import { blogScrollPostsQuery } from "@/lib/sanity/blog";
import BlogPostCard from "@/components/blog/BlogPostCard"; // ✅ new reusable card

export default function BlogNav() {
  const [posts, setPosts] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState(null); // kept for future tags
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 6;

  // Fetch posts (Sanity)
  useEffect(() => {
    (async () => {
      try {
        const items = await sanityClient.fetch(blogScrollPostsQuery);
        const list = items || [];
        setPosts(list);

        // ✅ Debug logs: confirm tag payload shape + totals
        console.groupCollapsed("[BlogScroll] serviceTags debug");
        console.log("posts:", list.length);
        console.log(
          "posts with serviceTags:",
          list.filter((p) => (p?.serviceTags || []).length > 0).length,
        );
        console.log(
          "total tag refs returned:",
          list.reduce(
            (acc, p) => acc + ((p?.serviceTags || []).length || 0),
            0,
          ),
        );
        console.log(
          "sample (first 5 posts) tags:",
          list.slice(0, 5).map((p) => ({
            slug: p?.slug,
            title: p?.postTitle,
            serviceTags: (p?.serviceTags || []).map((t) => ({
              _id: t?._id,
              title: t?.title,
              slug: t?.slug,
            })),
          })),
        );
        console.groupEnd();
      } catch (error) {
        console.error("Failed to fetch blog posts from Sanity:", error);
      }
    })();
  }, []);

  // Tags disabled for now (until tags exist)
  const allTags = useMemo(() => [], []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return posts.filter((p) => {
      // Tag filter is no-op until tags exist
      const tagMatch = !selectedTagId ? true : false;

      const titleMatch = q
        ? (p.postTitle || "").toLowerCase().includes(q)
        : true;

      return tagMatch && titleMatch;
    });
  }, [posts, selectedTagId, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const atStart = page === 0;
  const atEnd = page >= totalPages - 1;

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [selectedTagId, searchQuery]);

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
    setSelectedTagId((curr) => (curr === tagId ? null : tagId));
  }

  // --- Shared tag styles to match Project Navigation ---
  const tagBase =
    "px-3 py-0 rounded-md h-6 text-sm transition whitespace-nowrap";
  const tagActive = "bg-[var(--mesm-yellow)] text-[var(--mesm-grey)]";
  const tagInactive =
    "bg-[var(--mesm-grey-dk)] text-[var(--mesm-grey)] cursor-pointer hover:bg-[var(--mesm-yellow)] hover:text-[var(--background)]";

  return (
    <section className="w-full">
      {/* Controls: search + global tags */}
      <div className="mb-3 flex flex-col gap-4 md:flex-col md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <input
            id="blog-search"
            type="search"
            placeholder="Search blog titles…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[var(--mesm-grey-dk)] bg-transparent px-3 py-2 pr-8 text-sm outline-none focus:ring-1 focus:ring-[var(--mesm-l-grey)]"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--foreground)] hover:text-[var(--mesm-l-grey)] duration-100 text-lg leading-none text-sm px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tag filter bar (hidden until tags exist) */}
        {!!allTags.length && (
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => onTagClick(null)}
              className={[
                tagBase,
                selectedTagId === null ? tagActive : tagInactive,
              ].join(" ")}
              aria-pressed={selectedTagId === null}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={`global-tag-${tag.id}`}
                type="button"
                onClick={() => onTagClick(tag.id)}
                className={[
                  tagBase,
                  selectedTagId === tag.id ? tagActive : tagInactive,
                ].join(" ")}
                aria-pressed={selectedTagId === tag.id}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active filter + results count */}
      <div className="mb-2 flex items-center justify-between text-xs">
        <div className="opacity-70">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
          {searchQuery ? ` for “${searchQuery}”` : ""}
        </div>

        {/* Clear tag button hidden until tags exist */}
        {selectedTagId && !!allTags.length && (
          <button
            className={[
              tagBase,
              "bg-[var(--mesm-grey)] text-[var(--background)] hover:bg-[var(--mesm-yellow)]",
            ].join(" ")}
            onClick={() => onTagClick(selectedTagId)}
          >
            Clear tag ✕
          </button>
        )}
      </div>

      {/* Grid of posts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 transition-all duration-300">
        {visiblePosts.map((post) => (
          <BlogPostCard key={`blog-${post.slug}`} post={post} />
        ))}
      </div>

      {/* Pagination dots */}
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
