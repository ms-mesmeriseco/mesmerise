"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { getClient } from "@/lib/apollo-client";
import { GET_ALL_LANDING_PAGES } from "@/lib/graphql/queries/getLandingPages";
import { GET_ALL_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";
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
          query: GET_ALL_BLOG_POSTS,
        });
        setBlogPosts(data?.blogPostPageCollection?.items || []);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      }
    }
    fetchBlogPosts();
  }, []);

  return (
    <footer className="relative z-200 bg-[var(--footer-bg)] text-[color:var(--footer-txt)] p-[var(--global-margin-md)] min-h-[70vh]">
      <section
        data-marker=" "
        className="max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-[var(--global-margin-sm)]"
      >
        {/* Spacer */}
        <div className="col-span-1">
          <h5 className="text-lg font-normal mb-2">Quick Links</h5>
          <ul className="space-y-1 text-sm">
            <li>
              <a
                href="/about"
                className="text-[var(--font-size)] font-[var(--font-family)]"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/services"
                className="text-[var(--font-size)] font-[var(--font-family)]"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="/work"
                className="text-[var(--font-size)] font-[var(--font-family)]"
              >
                Work
              </a>
            </li>
            <li>
              <a
                href="/connect"
                className="text-[var(--font-size)] font-[var(--font-family)]"
              >
                Contact
              </a>
            </li>
          </ul>
          <h5 className="text-lg font-normal mb-2">Collaboration Models</h5>
          <ul className="space-y-1 text-sm">
            <li>
              <a
                href="/collaboration/defined"
                className="text-[var(--font-size)] font-[var(--font-family)]"
              >
                Defined
              </a>
            </li>
            <li>
              <a
                href="/collaboration/continuous"
                className="text-[var(--font-size)] font-[var(--font-family)]"
              >
                Continuous
              </a>
            </li>
          </ul>

          <h5 className="text-lg font-normal mb-2">Insights</h5>
          <ul className="space-y-1 text-sm">
            {blogPosts.slice(0, 4).map((post) => (
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
          <h5 className="text-lg font-normal mb-2">Offerings</h5>
          <ul className="space-y-1 text-sm">
            <li>
              <a
                href="/services/strategy/"
                className="text-[var(--font-size)] font-[var(--font-family)]"
              >
                Strategy
              </a>
            </li>
            <li>
              <a
                href="/services/branding/"
                className="text-[var(--font-size)] font-[var(--font-family)]"
              >
                Branding
              </a>
            </li>
            <li>
              <a
                href="/services/website/"
                className="text-[var(--font-size)] font-[var(--font-family)]"
              >
                Website
              </a>
            </li>
            <li>
              <a
                href="/services/performance-growth/"
                className="text-[var(--font-size)] font-[var(--font-family)]"
              >
                Performance & Growth
              </a>
            </li>
            <li>
              <a
                href="/services/analytics/"
                className="text-[var(--font-size)] font-[var(--font-family)]"
              >
                Analytics
              </a>
            </li>
          </ul>
          <h5 className="text-lg font-normal mb-2">Snoop</h5>
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
        <div className="col-span-2 flex items-start"></div>
      </section>
    </footer>
  );
}
