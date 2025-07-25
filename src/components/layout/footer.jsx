"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { getClient } from "@/lib/apollo-client";
import { GET_ALL_LANDING_PAGES } from "@/lib/graphql/queries/getLandingPages";
import { GET_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";
import useSectionMarker from "@/hooks/useSectionMarker";

export default function Footer() {
  useSectionMarker("footer");
  const [landingPages, setLandingPages] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchLandingPages() {
      try {
        const { data } = await getClient().query({
          query: GET_ALL_LANDING_PAGES,
        });
        setLandingPages(data?.landingPageCollection?.items || []);
      } catch (error) {
        console.error("Failed to fetch landing pages:", error);
      }
    }
    fetchLandingPages();
  }, []);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const { data } = await getClient().query({
          query: GET_BLOG_POSTS,
        });
        setBlogPosts(data?.blogPostPageCollection?.items || []);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      }
    }
    fetchBlogPosts();
  }, []);

  return (
    <footer className="bg-[var(--footer-bg)] text-[color:var(--footer-txt)] p-[var(--global-margin-lg)] h-[80vh]">
      <section
        data-marker=" "
        className="max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[var(--global-margin-sm)]"
      >
        {/* Spacer */}
        <div className="col-span-1">
          <h5 className="text-lg font-semibold mb-2">Navigation</h5>
          <ul className="space-y-1 text-sm">
            <li>
              <a
                href="/about"
                className="text-[var(--foreground)] text-[var(--font-size)] font-[var(--font-family)]"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/services"
                className="text-[var(--foreground)] text-[var(--font-size)] font-[var(--font-family)]"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="/work"
                className="text-[var(--foreground)] text-[var(--font-size)] font-[var(--font-family)]"
              >
                Work
              </a>
            </li>
          </ul>
        </div>
        {/* Navigation */}
        <div className="col-span-1">
          <h5 className="text-lg font-semibold mb-2">Landing Pages</h5>
          <ul className="space-y-1 text-sm">
            {landingPages.map((page) => (
              <li key={page.pageSlug}>
                <Link href={`/${page.pageSlug}`} className="hover:underline">
                  {page.pageTitle}
                </Link>
              </li>
            ))}
            {blogPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.postTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className="col-span-1">
          <h5 className="text-lg font-semibold mb-2">
            <a href="/connect/">Connect</a>
          </h5>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#">LinkedIn</a>
            </li>
            <li>
              <a href="#">Instagram</a>
            </li>
            <li>
              <a href="#">Email</a>
            </li>
          </ul>
        </div>
        {/* Logo */}
        <div className="col-span-1 flex items-start"></div>
      </section>
    </footer>
  );
}
