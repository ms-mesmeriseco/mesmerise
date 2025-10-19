import PageTitleLarge from "@/components/layout/PageTitleLarge";
import CollabModel from "@/components/home/CollabModel";

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
    },
    twitter: { card: "summary_large_image", title, description },
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
