"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getClient } from "@/lib/apollo-client";
import { GET_ALL_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";

export default function BlogScroll() {
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
    <section className="w-full py-[var(--global-margin-lg)] px-[var(--global-margin-sm)]">
      <div className="flex overflow-x-auto gap-[var(--global-margin-sm)] pb-[var(--global-margin-sm)]">
        {posts.map((post, index) => (
          <Link
            key={`blog-${post.slug}-${index}`}
            href={`/blog/${post.slug}`}
            className="relative group w-[32vw] h-[24vw] min-w-[16rem] rounded-md overflow-hidden border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] duration-200 flex-shrink-0"
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
              <div className="text-sm font-bold">
                <h5>{post.postTitle}</h5>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
