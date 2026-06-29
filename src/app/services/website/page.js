import ServicePageBase from "@/components/services/ServicePageBase.jsx";
import PackagesRow from "@/components/services/PackagesRow.jsx";

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
  const baseUrl = "https://www.mesmeriseco.com";
  const canonicalUrl = `/services/website/`;

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
