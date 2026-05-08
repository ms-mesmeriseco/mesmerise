// app/sitemap.xml/route.js
export const runtime = "nodejs";
// Rebuild roughly hourly; search engines cache aggressively anyway
export const revalidate = 3600;

import { groq } from "next-sanity";
import { sanityClient } from "@/sanity/client"; // same import as your /work page

function iso(dateLike) {
  try {
    const d = new Date(dateLike);
    if (!isNaN(d.getTime())) return d.toISOString();
  } catch {}
  return undefined;
}

// ── Sanity queries (light — only fields the sitemap needs) ──────────────────

const landingPagesQuery = groq`
  *[_type == "landingPage"] {
    "slug": pageSlug.current,
    _updatedAt
  }
`;

const blogPostsQuery = groq`
  *[_type == "blogPostPage" && contentfulArchived != true] | order(postDate desc) {
    "slug": slug.current,
    postDate,
    _updatedAt
  }
`;

const projectPagesQuery = groq`
  *[_type == "projectPage"] {
    "slug": slug.current,
    projectDate,
    _updatedAt
  }
`;

// ───────────────────────────────────────────────────────────────────────────

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.mesmeriseco.com";

  const [landingItems, blogItems, projItems] = await Promise.all([
    sanityClient.fetch(landingPagesQuery),
    sanityClient.fetch(blogPostsQuery),
    sanityClient.fetch(projectPagesQuery),
  ]);

  // ── Static routes ──────────────────────────────────────────────────────────
  const staticRoutes = [
    { loc: `${baseUrl}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${baseUrl}/about`, changefreq: "monthly", priority: "0.7" },
    { loc: `${baseUrl}/services`, changefreq: "monthly", priority: "0.7" },
    { loc: `${baseUrl}/work`, changefreq: "monthly", priority: "0.7" },
    { loc: `${baseUrl}/connect`, changefreq: "monthly", priority: "0.7" },
    { loc: `${baseUrl}/blog`, changefreq: "weekly", priority: "0.7" },
    {
      loc: `${baseUrl}/collaboration/defined`,
      changefreq: "weekly",
      priority: "0.7",
    },
    {
      loc: `${baseUrl}/collaboration/continuous`,
      changefreq: "weekly",
      priority: "0.7",
    },
  ];

  // ── Landing pages ──────────────────────────────────────────────────────────
  // landingBySlugQuery uses pageSlug.current, so slug here is already the clean value
  const landingRoutes = (landingItems ?? [])
    .map((p) => {
      const slug = p?.slug?.replace(/^\/+/, "");
      if (!slug) return null;
      const lastmod = iso(p?._updatedAt) || undefined;

      return {
        loc: `${baseUrl}/${slug}`,
        changefreq: "weekly",
        priority: "0.8",
        lastmod,
      };
    })
    .filter(Boolean);

  // ── Blog posts ─────────────────────────────────────────────────────────────
  const blogRoutes = (blogItems ?? [])
    .map((p) => {
      const slug = p?.slug?.replace(/^\/+/, "");
      if (!slug) return null;
      // postDate matches blogPostBySlugQuery; fall back to _updatedAt (Sanity native)
      const lastmod = iso(p?.postDate) || iso(p?._updatedAt) || undefined;

      return {
        loc: `${baseUrl}/blog/${slug}`,
        changefreq: "monthly",
        priority: "0.6",
        lastmod,
      };
    })
    .filter(Boolean);

  // ── Project pages ──────────────────────────────────────────────────────────
  const projRoutes = (projItems ?? [])
    .map((p) => {
      const slug = p?.slug?.replace(/^\/+/, "");
      if (!slug) return null;
      // projectDate matches your projectsQuery on /work
      const lastmod = iso(p?.projectDate) || iso(p?._updatedAt) || undefined;

      return {
        loc: `${baseUrl}/work/${slug}`,
        changefreq: "monthly",
        priority: "0.6",
        lastmod,
      };
    })
    .filter(Boolean);

  // ── De-dupe & build XML ────────────────────────────────────────────────────
  const seen = new Set();
  const urls = [
    ...staticRoutes,
    ...landingRoutes,
    ...blogRoutes,
    ...projRoutes,
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
    const lastmodTag = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : "";
    return `  <url>
    <loc>${u.loc}</loc>${lastmodTag}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
