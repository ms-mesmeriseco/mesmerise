'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getClient } from '@/lib/apollo-client';
import { GET_ALL_LANDING_PAGES } from '@/lib/graphql/queries/getLandingPages';
import { GET_BLOG_POSTS } from '@/lib/graphql/queries/getBlogPosts';

export default function Footer() {
  const [landingPages, setLandingPages] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    async function fetchLandingPages() {
      try {
        const { data } = await getClient().query({
          query: GET_ALL_LANDING_PAGES,
        });
        setLandingPages(data?.landingPageCollection?.items || []);
      } catch (error) {
        console.error('Failed to fetch landing pages:', error);
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
        console.error('Failed to fetch blog posts:', error);
      }
    }

    fetchBlogPosts();
      
  }, []);
      console.log(blogPosts);

  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo */}
        <div className="col-span-1 flex items-start">
          <Image
            src="/logo_white-MESMERISE.png"
            alt="MESMERISE Logo"
            width={160}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Spacer */}
        <div className="col-span-1">
          <h4 className="text-lg font-semibold mb-2">Blog Posts</h4>
          <ul className="space-y-1 text-sm">
            {blogPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:underline"
                >
                  {post.postTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation */}
        <div className="col-span-1">
          <h4 className="text-lg font-semibold mb-2">Landing Pages</h4>
          <ul className="space-y-1 text-sm">
            {landingPages.map((page) => (
              <li key={page.pageSlug}>
                <Link
                  href={`/${page.pageSlug}`}
                  className="hover:underline"
                >
                  {page.pageTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className="col-span-1">
          <h4 className="text-lg font-semibold mb-2">Connect</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Email</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
