"use client";

import Link from "next/link";

export default function ServicesList() {
  const services = [
    { name: "Strategy", slug: "/services/strategy" },
    { name: "Branding", slug: "/services/branding" },
    { name: "Website", slug: "/services/website" },
    { name: "Performance & Growth", slug: "/services/performance-growth" },
    { name: "Analytics", slug: "/services/analytics" },
  ];

  return (
    <section
      data-marker="capabilities"
      className="min-h-screen flex flex-col justify-center"
    >
      <ul className="space-y-8">
        {services.map((s, idx) => (
          <li key={idx} className="no-list">
            <Link
              href={s.slug}
              className="block border-b border-current px-[var(--global-margin-lg)] py-[var(--global-margin-sm)] 
                         text-4xl md:text-6xl font-medium transition-all duration-200 ease-in-out
                         opacity-30 hover:opacity-100 hover:translate-x-4 page-title-large"
            >
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
