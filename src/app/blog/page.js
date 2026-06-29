import BlogNav from "@/components/sanity-blocks/BlogNav";
import PageTitleLarge from "@/components/ui/PageTitleLarge";

export async function generateMetadata() {
  const title = "Blog | Mesmerise Digital";
  const description =
    "When your data speaks with one voice, decisions become clear. We turn analytics into strategy that drives undeniable results.";
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
