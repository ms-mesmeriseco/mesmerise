"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getClient } from "@/lib/apollo-client";
import { GET_ALL_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";

export default function BlogNav() {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[var(--global-margin-sm)]">
        {posts.slice(0, 4).map((post, index) => (
          <Link
            key={`blog-${post.slug}-${index}`}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden border-[var(--foreground)] duration-200 flex flex-col h-fit"
          >
            {/* Image */}
            {post.heroImage?.url && (
              <Image
                src={post.heroImage.url}
                alt={post.heroImage.title || "Blog image"}
                width={post.heroImage.width || 800}
                height={post.heroImage.height || 600}
                className="object-cover w-full rounded-md aspect-6/4"
                style={{ display: "block" }}
              />
            )}

            {/* Text below image */}
            <div className="py-6">
              <h4 className="text-sm font-bold">{post.postTitle}</h4>
            </div>
          </Link>
        ))}
        {posts.slice(5, 9).map((post, index) => (
          <Link
            key={`blog-${post.slug}-${index}`}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden border-[var(--foreground)] duration-200 flex flex-col h-fit"
          >
            {/* Image */}
            {post.heroImage?.url && (
              <Image
                src={post.heroImage.url}
                alt={post.heroImage.title || "Blog image"}
                width={post.heroImage.width || 800}
                height={post.heroImage.height || 600}
                className="object-cover w-full rounded-md aspect-6/4"
                style={{ display: "block" }}
              />
            )}

            {/* Text below image */}
            <div className="py-6">
              <h4 className="text-sm font-bold">{post.postTitle}</h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
