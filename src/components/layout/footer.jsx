'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getClient } from '@/lib/apollo-client';
// import { GET_LANDING_PAGES } from '@/lib/graphql/queries/getLandingPages';

export default function Footer() {
  const [landingPages, setLandingPages] = useState([]);

  useEffect(() => {
    async function fetchLandingPages() {
      const { data } = await getClient().query({ query: GET_LANDING_PAGES });
      setLandingPages(data?.landingPageCollection?.items || []);
    }
    fetchLandingPages();
  }, []);

  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo Column */}
        <div className="col-span-1 flex items-start">
          <Image
            src="/logo_white-MESMERISE.png"
            alt="MESMERISE Logo"
            width={160}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Spacer for layout balance */}
        <div className="col-span-1 hidden sm:block" />

        {/* Navigation Links */}
        <div className="col-span-1">
          <h4 className="text-lg font-semibold mb-2">Landing Pages</h4>
          <ul className="space-y-1 text-sm">
            {landingPages.map((page) => (
              <li key={page.pageSlug}>
                <Link
                  href={`/[slug]/${page.pageSlug}`}
                  className="hover:underline text-gray-300"
                >
                  {page.pageTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Placeholder fourth column */}
        <div className="col-span-1">
          <h4 className="text-lg font-semibold mb-2">Connect</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Email</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
