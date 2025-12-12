// components/cms-blocks/BlogRail.jsx (or .tsx)
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { sanityClient } from "@/sanity/client";
import { blogRailPostsQuery } from "@/lib/sanity/blog";

export default function BlogRail() {
  const [posts, setPosts] = useState([]);
  const pathname = usePathname();
  const currentSlug = pathname?.split("/").pop(); // /blog/hello-world → "hello-world"

  useEffect(() => {
    if (!currentSlug) return;

    async function fetchBlogPosts() {
      try {
        const items = await sanityClient.fetch(blogRailPostsQuery);

        // Remove the current post from the rail
        const filtered = (items || []).filter(
          (post) => post.slug !== currentSlug
        );

        setPosts(filtered);
      } catch (error) {
        console.error("Failed to fetch blog posts from Sanity:", error);
      }
    }

    fetchBlogPosts();
  }, [currentSlug]);

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {posts.slice(0, 3).map((post) => (
          <div
            key={`blog-rail-post-${post._id || post.slug}`}
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
                    alt={post.heroImage.alt || "Blog image"}
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

            {/* Tags – omitted for now, since Sanity schema doesn't yet have them */}
            {/* If you add a tags field later, we can render chips again here */}
          </div>
        ))}
      </div>
    </section>
  );
}
