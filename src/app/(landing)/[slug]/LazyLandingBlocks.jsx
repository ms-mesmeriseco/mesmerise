// src/app/(landing)/[slug]/LazyLandingBlocks.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { getClient } from "@/lib/apollo-client";
import { GET_LANDING_PAGE_BLOCKS_BY_SLUG } from "@/lib/graphql/queries/getLandingPages";
import PageBase from "@/components/layout/PageBase";

export default function LazyLandingBlocks({ slug }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const triggerRef = useRef(null);

  // Start loading when section enters viewport
  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "200px", // pre-load a bit before visible
        threshold: 0.1,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Run the Apollo query manually once we decide to load
  useEffect(() => {
    if (!shouldLoad) return;

    let cancelled = false;

    async function fetchBlocks() {
      try {
        setLoading(true);
        setError(null);

        const client = getClient();
        const result = await client.query({
          query: GET_LANDING_PAGE_BLOCKS_BY_SLUG,
          variables: { slug },
        });

        if (!cancelled) {
          setData(result.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchBlocks();

    return () => {
      cancelled = true;
    };
  }, [shouldLoad, slug]);

  const blocks =
    data?.landingPageCollection?.items?.[0]?.pageBlocksCollection?.items ?? [];

  return (
    <section ref={triggerRef} className="w-full">
      {/* Before we decide to load */}
      {!shouldLoad && (
        <div className="w-full py-16 text-center text-sm text-[var(--mesm-grey)]" />
      )}

      {/* After load triggered, while fetching */}
      {shouldLoad && loading && (
        <div className="w-full py-16 text-center text-sm text-[var(--mesm-grey)]">
          Loading page content…
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="w-full py-16 text-center text-sm text-red-500">
          Something went wrong loading this section.
        </div>
      )}

      {/* Render blocks */}
      {blocks.length > 0 && <PageBase blocks={blocks} />}
    </section>
  );
}
