import BlogNav from "@/components/sanity-blocks/BlogNav";
import PageTitleLarge from "@/components/ui/PageTitleLarge";
import { DEFAULT_OG_IMAGE_URL, absoluteUrl } from "@/lib/seo";

export async function generateMetadata() {
  const title = "Insights on Brand, Web & Performance | Mesmerise Digital";
  const description =
    "Unique industry insights on brand, web design, and performance marketing. Discover just what actually moves the needle for growing businesses.";
  const canonicalUrl = absoluteUrl("/blog/");

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

export default function BlogPage() {
  return (
    <>
      <PageTitleLarge text={"Blog"} />
      <BlogNav />
    </>
  );
}
