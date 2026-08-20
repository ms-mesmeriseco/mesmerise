import PageTitleLarge from "@/components/ui/PageTitleLarge";
import CollabModel from "@/components/home/CollabModel";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/seo";

export async function generateMetadata() {
  const title = "Collaboration Models | Mesmerise Digital";
  const description =
    "Discover how Mesmerise Digital partners with ambitious brands through two distinct collaboration models: Defined and Continuous. Choose the approach that aligns with your goals.";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mesmeriseco.com";

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/collaboration` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/collaboration`,
      siteName: "Mesmerise Digital",
      type: "website",
      images: [
        {
          url: DEFAULT_OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: DEFAULT_OG_IMAGE_URL,
    },
  };
}

export default function CollabPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <PageTitleLarge text="Collaboration Models" />
        <CollabModel />
      </div>
    </>
  );
}
