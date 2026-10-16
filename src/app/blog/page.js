import BlogNav from "@/components/sanity-blocks/BlogNav";
import PageTitleLarge from "@/components/ui/PageTitleLarge";
import { DEFAULT_OG_IMAGE_URL, absoluteUrl } from "@/lib/seo";
import { sanityClient } from "@/sanity/client";
import { blogScrollPostsQuery } from "@/lib/sanity/blog";

export const revalidate = 60;

export async function generateMetadata() {
  const title = "Insights on Brand, Web & Performance | Mesmerise Digital";
  const description =
    "Unique industry insights on brand, web design, and performance marketing. Discover just what actually moves the needle for growing businesses.";
  const canonicalUrl = absoluteUrl("/blog");

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Mesmerise Digital",
      images: [
        {
          url: DEFAULT_OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: description,
        },
      ],
      locale: "en_AU",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: DEFAULT_OG_IMAGE_URL,
    },
  };
}

export default async function BlogPage() {
  // Fetch on the server so posts are in the initial HTML (crawlers see real content)
  const posts = (await sanityClient.fetch(blogScrollPostsQuery)) || [];

  return (
    <>
      <PageTitleLarge text={"Blog"} />
      <BlogNav initialPosts={posts} />
    </>
  );
}
