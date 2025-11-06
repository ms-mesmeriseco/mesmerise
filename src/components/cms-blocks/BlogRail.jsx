"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getClient } from "@/lib/apollo-client";
import { GET_ALL_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";

export default function BlogRail() {
  const [posts, setPosts] = useState([]);

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

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {posts.slice(0, 3).map((post, index) => (
          <Link
            key={`blog-${post.slug}-${index}`}
            href={`/blog/${post.slug}`}
            className="group relative w-full aspect-[16/9] rounded-md overflow-hidden border border-[var(--mesm-grey-dk)] hover:border-[var(--mesm-grey)] transition-colors duration-200"
          >
            {/* Image */}
            {post.heroImage?.url && (
              <Image
                src={post.heroImage.url}
                alt={post.heroImage.title || "Blog image"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/60 opacity-0 group-hover:opacity-40 transition-opacity duration-300" />

            {/* Text */}
            <div className="absolute bottom-[var(--global-margin-sm)] left-[var(--global-margin-sm)] right-[var(--global-margin-sm)] text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <h5 className="text-sm font-bold leading-tight">
                {post.postTitle}
              </h5>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
