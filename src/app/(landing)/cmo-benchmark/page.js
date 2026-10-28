import CmoLanding from "./CmoLanding";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/seo";

// Working title: kept out of search until the quiz name is final
export async function generateMetadata() {
  const title = "Marketing Leadership Benchmark | Mesmerise";
  const description =
    "In 7 minutes, benchmark your marketing across eight areas and leave with three priorities, plus the business case for each.";
  const url = "https://www.mesmeriseco.com/cmo-benchmark";

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: false, follow: false },
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

export default function CmoBenchmarkPage() {
  return <CmoLanding />;
}
