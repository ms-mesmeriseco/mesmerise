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
      data-marker="OUR CORE OFFERINGS"
      className="flex flex-col justify-center"
    >
      <h6>What's on offer</h6>
      <ul className="border-t border-[var(--mesm-grey-dk)]">
        {services.map((s, idx) => (
          <li
            key={idx}
            className="no-list border-b border-[var(--mesm-grey-dk)]"
          >
            <Link
              href={s.slug}
              className="block border-1 border-[var(--mesm-grey)] my-4 rounded-md px-[var(--global-margin-lg)] py-[var(--global-margin-sm)] 
                         text-4xl md:text-6xl font-medium transition-all duration-200 ease-in-out
                         opacity-30 hover:opacity-100 hover:translate-x-1 page-title-large"
            >
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
