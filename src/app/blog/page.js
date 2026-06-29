import BlogNav from "@/components/sanity-blocks/BlogNav";
import PageTitleLarge from "@/components/ui/PageTitleLarge";

export async function generateMetadata() {
  const title = "Insights on Brand, Web & Performance | Mesmerise Digital";
  const description =
    "Unique industry insights on brand, web design, and performance marketing. Discover just what actually moves the needle for growing businesses.";
  const baseUrl = "https://www.mesmeriseco.com";
  const canonicalUrl = `/blog/`;

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
          url: `${baseUrl}/assets/social-default.png`,
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
      images: `${baseUrl}/assets/social-default.png`,
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
