"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getClient } from "@/lib/apollo-client";
import { GET_PROJECT_PAGES } from "@/lib/graphql/queries/getProjectPages";
import SingleCaseStudy from "@/components/cms-blocks/SingleCaseStudy";

export default function FeaturedCaseStudy({ slug, showLink = true }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await getClient().query({
          query: GET_PROJECT_PAGES,
          fetchPolicy: "no-cache",
        });
        const items = data?.projectPageCollection?.items || [];
        const found = items.find((p) => p.slug === slug) || null;
        if (mounted) setPage(found);
      } catch (e) {
        console.error("Failed to fetch project pages:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <section className="-mx-[var(--global-margin-lg)]">
        <div className="w-full h-[70vh] bg-neutral-900 animate-pulse rounded-none" />
      </section>
    );
  }

  if (!page) return null;

  // Map to your SingleCaseStudy props
  const summary = page.summary ?? page.projectScope ?? null;
  const results = page.results ?? null;
  const timeFrame = page.resultsTimeFrame ?? page.timeFrame ?? "";

  return (
    <div className="-mx-[var(--global-margin-lg)]">
      <SingleCaseStudy
        study={{ caseStudy: page }}
        summary={summary}
        results={results}
        timeFrame={timeFrame}
      />

    </div>
  );
}
