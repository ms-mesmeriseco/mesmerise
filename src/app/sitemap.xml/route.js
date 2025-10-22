// app/sitemap.xml/route.js
export const runtime = "nodejs";
// Rebuild roughly hourly; search engines cache aggressively anyway
export const revalidate = 3600;

import { getClient } from "@/lib/apollo-client";
import { GET_ALL_LANDING_PAGES } from "@/lib/graphql/queries/getLandingPages";
import { GET_ALL_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";
import { GET_PROJECT_PAGES } from "@/lib/graphql/queries/getProjectPages";

function iso(dateLike) {
  try {
    const d = new Date(dateLike);
    if (!isNaN(d.getTime())) return d.toISOString();
  } catch {}
  return undefined;
}

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.mesmeriseco.com";

  const client = getClient();

  // Fetch collections (keep fields light)
  const [{ data: lpData }, { data: blogData }, { data: projData }] =
    await Promise.all([
      client.query({
        query: GET_ALL_LANDING_PAGES,
        variables: { limit: 100 }, // bump if you have more
        fetchPolicy: "no-cache",
      }),
      client.query({
        query: GET_ALL_BLOG_POSTS,
        variables: { limit: 100 },
        fetchPolicy: "no-cache",
      }),
      client.query({
        query: GET_PROJECT_PAGES,
        variables: { limit: 100 },
        fetchPolicy: "no-cache",
      }),
    ]);

  // Extract routes
  const landingItems = lpData?.landingPageCollection?.items ?? [];
  const blogItems = blogData?.blogPostPageCollection?.items ?? [];
  const projItems = projData?.projectPageCollection?.items ?? [];

  const staticRoutes = [
    { loc: `${baseUrl}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${baseUrl}/about`, changefreq: "monthly", priority: "0.7" },
    { loc: `${baseUrl}/services`, changefreq: "monthly", priority: "0.7" },
    { loc: `${baseUrl}/work`, changefreq: "monthly", priority: "0.7" },
    { loc: `${baseUrl}/connect`, changefreq: "monthly", priority: "0.7" },
    { loc: `${baseUrl}/blog`, changefreq: "weekly", priority: "0.7" },
    {
      loc: `${baseUrl}/defined`,
      changefreq: "weekly",
      priority: "0.7",
    },
    {
      loc: `${baseUrl}/continuous`,
      changefreq: "weekly",
      priority: "0.7",
    },
  ];

  const landingRoutes = landingItems
    .map((p) => {
      // prefer a path field if you have it; fall back to /{slug}
      const slug = p?.pageSlug?.replace(/^\/+/, "") || "";
      const path =
        (p?.path && String(p.path)) ||
        (slug ? `/${slug}`.replace(/\/+/, "/") : "");
      const lastmod =
        iso(p?.updatedAt) ||
        iso(p?.sys?.publishedAt) ||
        iso(p?.sys?.updatedAt) ||
        undefined;

      return path
        ? {
            loc: `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`,
            changefreq: "weekly",
            priority: "0.8",
            lastmod,
          }
        : null;
    })
    .filter(Boolean);

  const blogRoutes = blogItems
    .map((p) => {
      const slug = p?.slug?.replace(/^\/+/, "");
      if (!slug) return null;
      const lastmod =
        iso(p?.postDate) ||
        iso(p?.updatedAt) ||
        iso(p?.sys?.updatedAt) ||
        iso(p?.sys?.publishedAt) ||
        undefined;

      return {
        loc: `${baseUrl}/blog/${slug}`,
        changefreq: "monthly",
        priority: "0.6",
        lastmod,
      };
    })
    .filter(Boolean);

  const PROJECT_PREFIX = "/work"; // change if your route is different (e.g. "/projects")

  const projRoutes = projItems
    .map((p) => {
      const slug = p?.slug?.replace(/^\/+/, "");
      if (!slug) return null;

      const lastmod =
        iso(p?.projectDate) || // from your fragment
        iso(p?.updatedAt) || // in case you later add it
        iso(p?.sys?.updatedAt) ||
        iso(p?.sys?.publishedAt) ||
        undefined;

      return {
        loc: `${baseUrl}${PROJECT_PREFIX}/${slug}`,
        changefreq: "monthly",
        priority: "0.6",
        lastmod,
      };
    })
    .filter(Boolean);

  // De-dupe by URL just in case
  const seen = new Set();
  const urls = [
    ...staticRoutes,
    ...landingRoutes,
    ...blogRoutes,
    ...projRoutes, // <— include projects!
  ].filter((u) => {
    if (!u?.loc) return false;
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urls
  .map((u) => {
    const lastmodTag = u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "";
    return `  <url>
    <loc>${u.loc}</loc>
    ${lastmodTag}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
      // Cache at the edge for 1h, allow stale for a day while revalidating
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
