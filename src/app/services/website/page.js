import ServicePageBase from "@/components/services/ServicePageBase.jsx";
import PackagesRow from "@/components/services/PackagesRow.jsx";
import { DEFAULT_OG_IMAGE_URL, absoluteUrl } from "@/lib/seo";

import {
  heroMedia,
  heroMobile,
  para1Content,
  para2Content,
  para3Content,
  serviceTags,
  processSteps,
  PACKAGES,
  finalCTA,
  servicesFAQ,
} from "./content.jsx";

export async function generateMetadata() {
  const title = "Conversion Driven Web Design | Mesmerise Digital";
  const description =
    "Websites engineered for emotion and results. We design experiences that look exceptional and sell effortlessly.";
  const canonicalUrl = absoluteUrl("/services/website/");

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

export default function WebsitePage() {
  return (
    <>
      <ServicePageBase
        heroTitle={"Website"}
        heroMedia={heroMedia}
        heroMobile={heroMobile}
        serviceTags={serviceTags}
        para1Content={para1Content}
        para2Content={para2Content}
        para3Content={para3Content}
        processSteps={processSteps}
        customBlock={<PackagesRow packageData={PACKAGES} />}
        finalCTA={finalCTA}
        servicesFAQ={servicesFAQ}
      />
    </>
  );
}
