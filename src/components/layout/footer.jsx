"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSectionMarker from "@/hooks/useSectionMarker";
import FooterSignup from "./FooterSignup";

import { sanityClient } from "@/sanity/client";
import { groq } from "next-sanity";

// ✅ Inline GROQ (drop-in, no extra files needed)
const FOOTER_BLOG_POSTS_QUERY = groq`
*[
  _type == "blogPostPage"
  && contentfulArchived != true
  && defined(slug.current)
  && $tagSlug in serviceTags[]->slug.current
]
| order(postDate desc)[0...$limit]{
  _id,
  "slug": slug.current,
  postTitle
}
`;

export default function Footer() {
  useSectionMarker("footer");
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const items = await sanityClient.fetch(FOOTER_BLOG_POSTS_QUERY, {
          limit: 10,
          tagSlug: "show-blog-in-footer", // ✅ tag slug in Sanity serviceTags
        });

        if (!alive) return;
        setBlogPosts(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error("Failed to fetch blog posts:", err);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[200] bg-[var(--background)] border-t-1 border-[var(--mesm-grey-dk)] m-[var(--global-margin-md)]">
      {/* Top strip: brand + newsletter */}
      <section data-marker=" " className="mx-auto w-full pb-12 md:pb-16 pt-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Brand / wordmark */}
          <div className="flex flex-col gap-4">
            <div className="flex items-end gap-3">
              {/* Update the src to your actual wordmark path */}
              <Link href="/" aria-label="Mesmerise Digital Home">
                <Image
                  src="/wordmark.svg"
                  alt="Mesmerise Digital"
                  width={240}
                  height={60}
                  priority
                />
              </Link>
              {/* optional small accent dot */}
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--mesm-blue)]" />
            </div>
            <p className="text-sm/6 opacity-80 max-w-[350px]">
              We don't just run ads. We turn strangers into loyal customers.
              <br />
              <br />
            </p>
          </div>

          <div className="rounded-2xl">
            <h6 className="opacity-80">
              {" "}
              Join to gain insight across brand, web, and performance you won't
              find anywhere else.
            </h6>
            <FooterSignup />
          </div>
        </div>
      </section>

      {/* Link grid */}
      <nav
        aria-label="Footer"
        className="mx-auto w-full md:px-[var(--global-margin-md)] pb-12 md:pb-16"
      >
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5">
          {/* Column: Quick Links */}
          <div>
            <h5 className="mb-3 text-sm tracking-wide  opacity-80">
              Quick Links
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="footer-link" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/services">
                  Services
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/work">
                  Work
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/connect">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Collaboration */}
          <div>
            <h5 className="mb-3 text-sm tracking-wide  opacity-80">
              Collaboration
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="footer-link" href="/collaboration/defined">
                  Defined
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/collaboration/continuous">
                  Continuous
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Offerings */}
          <div>
            <h5 className="mb-3 text-sm tracking-wide  opacity-80">
              Offerings
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="footer-link" href="/services/strategy/">
                  Strategy
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/services/branding/">
                  Branding
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/services/website/">
                  Website
                </Link>
              </li>
              <li>
                <Link
                  className="footer-link"
                  href="/services/performance-growth/"
                >
                  Performance &amp; Growth
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/services/analytics/">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Insights (latest 10 by tag) */}
          <div className="col-span-1">
            <Link href="/blog">
              <h5 className="mb-3 text-sm tracking-wide opacity-80 hover:underline">
                Blog
              </h5>
            </Link>
            <ul className="grid grid-cols-1 text-sm">
              {blogPosts.map((post) => (
                <li key={post._id ?? post.slug}>
                  <Link
                    className="footer-link line-clamp-1 w-fit"
                    href={`/blog/${post.slug}`}
                  >
                    {post.postTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full flex-col items-start justify-between gap-4 md:px-[var(--global-margin-md)] py-5 text-sm opacity-80 md:flex-row md:items-center">
          <h6>© {year} Mesmerise Digital. All rights reserved.</h6>
          <ul className="flex items-center gap-5">
            <li>
              <a
                href="https://www.linkedin.com/company/mesmeriseco/"
                className="footer-link"
                target="_blank"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/mesmerise.digital/"
                className="footer-link"
                target="_blank"
              >
                Instagram
              </a>
            </li>
            <li>
              <a href="mailto:hello@mesmeriseco.com" className="footer-link">
                Email
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Minimal link styling for consistency */}
      <style jsx global>{`
        .footer-link {
          position: relative;
          /* remove display:inline-block so it won't fight line-clamp */
          transition: opacity 160ms ease;
          opacity: 0.9;
          padding-bottom: 3px;
          margin-bottom: 3px;
        }
        .footer-link:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
          border-radius: 6px;
        }
        .footer-link:hover {
          opacity: 1;
        }

        .footer-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0; /* was -2px (clipped by overflow) */
          width: 100%;
          height: 1px; /* slimmer line sits inside content box */
          background-color: var(--foreground);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .footer-link:hover::after {
          transform: scaleX(1);
        }
      `}</style>
    </footer>
  );
}
