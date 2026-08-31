import ServicePageBase from "@/components/services/ServicePageBase.jsx";
import { DEFAULT_OG_IMAGE_URL, absoluteUrl } from "@/lib/seo";

import {
  heroMedia,
  heroMobile,
  para1Content,
  para2Content,
  para3Content,
  serviceTags,
  processSteps,
  finalCTA,
  servicesFAQ,
} from "./content.jsx";

export async function generateMetadata() {
  const title = "Performance & Growth Marketing | Mesmerise Digital";
  const description =
    "We blend data, psychology and strategy to generate qualified traffic, lower CPA, and scale with integrity.";
  const canonicalUrl = absoluteUrl("/services/performance-growth");

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

export default function PerformancePage() {
  return (
    <>
      <ServicePageBase
        heroTitle={"Performance & Growth"}
        heroMedia={heroMedia}
        heroMobile={heroMobile}
        serviceTags={serviceTags}
        para1Content={para1Content}
        para2Content={para2Content}
        para3Content={para3Content}
        processSteps={processSteps}
        finalCTA={finalCTA}
        servicesFAQ={servicesFAQ}
      />
    </>
  );
}
