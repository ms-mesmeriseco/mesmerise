"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getClient } from "@/lib/apollo-client";
import { GET_ALL_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";

export default function BlogRail() {
  const [posts, setPosts] = useState([]);

  const pathname = usePathname();
  const currentSlug = pathname?.split("/").pop(); // /blog/hello-world → "hello-world"

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const { data } = await getClient().query({ query: GET_ALL_BLOG_POSTS });
        const items = data?.blogPostPageCollection?.items || [];

        // --- REMOVE the current page from the blog rail ---
        const filtered = items.filter((post) => post.slug !== currentSlug);

        // Normalize + filter tags + sort by date
        const normalized = filtered
          .map((p) => {
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
          })
          .sort((a, b) => {
            const da = a.postDate ? new Date(a.postDate).getTime() : 0;
            const db = b.postDate ? new Date(b.postDate).getTime() : 0;
            return db - da;
          });

        setPosts(normalized);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      }
    }

    if (currentSlug) fetchBlogPosts();
  }, [currentSlug]);

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {posts.slice(0, 3).map((post) => (
          <div
            key={`blog-rail-post-${post.slug}`}
            className="flex flex-col w-full"
          >
            {/* Image & Title link */}
            <Link
              href={`/blog/${post.slug}`}
              className="group relative block w-full overflow-hidden "
            >
              <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden border border-[var(--mesm-grey-dk)]">
                {post.heroImage?.url && (
                  <Image
                    src={post.heroImage.url}
                    alt={post.heroImage.title || "Blog image"}
                    fill
                    className="object-cover transition-transform duration-300 md:group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                )}
              </div>
              <div className="py-2">
                <h5 className="text-sm font-bold leading-tight text-[var(--mesm-grey)] group-hover:text-[var(--foreground)] transition-colors duration-200">
                  {post.postTitle}
                </h5>
              </div>
            </Link>

            {/* Tags */}
            {!!post._tags?.length && (
              <div className="flex flex-wrap items-center gap-1">
                {post._tags.map((tag) => (
                  <span
                    key={`${post.slug}-tag-${tag.id}`}
                    className="px-3 py-0.5 rounded-md text-sm transition whitespace-nowrap bg-[var(--mesm-grey-dk)] text-[var(--mesm-grey)]"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
