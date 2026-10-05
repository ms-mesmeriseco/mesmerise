import GrowthLeakLanding from "./GrowthLeakLanding";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/seo";

export async function generateMetadata() {
  const title = "Free Growth Leak Audit | Mesmerise";
  const description =
    "Find out in 4 minutes where your marketing spend is leaking. Get scored across six pillars and see your three costliest leaks.";
  const url = "https://www.mesmeriseco.com/growth-leak-audit";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        { url: DEFAULT_OG_IMAGE_URL, width: 1200, height: 630, alt: title },
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

export default function GrowthLeakAuditPage() {
  return <GrowthLeakLanding />;
}
