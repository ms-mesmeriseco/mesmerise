// components/cms-blocks/BlogRail.jsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { sanityClient } from "@/sanity/client";
import { blogRailPostsQuery } from "@/lib/sanity/blog";
import BlogPostCard from "@/components/blog/BlogPostCard";

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
          (post) => post.slug !== currentSlug,
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
          <BlogPostCard
            key={`blog-rail-post-${post._id || post.slug}`}
            post={post}
          />
        ))}
      </div>
    </section>
  );
}
