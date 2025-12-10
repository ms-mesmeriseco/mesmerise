"use client";

import { useEffect, useRef, useState } from "react";
import { sanityClient } from "@/sanity/client";
import { landingBySlugQuery } from "@/lib/sanity/landing";
import PageBase from "@/components/layout/PageBase";

async function fetchLanding(slug) {
  if (!slug) {
    console.error("fetchLanding called with no slug");
    return null;
  }

  try {
    const page = await sanityClient.fetch(landingBySlugQuery, { slug });

    if (!page) {
      console.warn(`No landing page found in Sanity for slug "${slug}"`);
    }

    return page;
  } catch (err) {
    console.error("fetchLanding Sanity error:", err);
    return null;
  }
}

export default function LazyLandingBlocks({ slug }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [data, setData] = useState(null); // will hold the Sanity landingPage doc
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

  // Fetch Sanity landing page once we decide to load
  useEffect(() => {
    if (!shouldLoad || !slug) return;

    let cancelled = false;

    async function fetchBlocks() {
      try {
        setLoading(true);
        setError(null);

        const page = await fetchLanding(slug);

        if (cancelled) return;

        if (!page) {
          setData(null);
          setError(new Error("Landing page not found"));
        } else {
          setData(page);
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

  // Assuming your GROQ returns:
  // *[_type == "landingPage" && pageSlug.current == $slug][0]{ ..., pageBlocks[]-> }
  const blocks = data?.pageBlocks ?? [];

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
      {blocks.length > 0 && !loading && !error && <PageBase blocks={blocks} />}
    </section>
  );
}
