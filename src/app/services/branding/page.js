import ServicePageBase from "@/components/services/ServicePageBase.jsx";

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
  const title = "Branding | Mesmerise Digital";
  const description =
    "We craft identity systems that fuse psychology, storytelling and design to turn first impressions into lifelong brand loyalty.";
  const baseUrl = "https://www.mesmeriseco.com";
  const canonicalUrl = `/services/branding/`;

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

export default function BrandingPage() {
  return (
    <>
      <ServicePageBase
        heroTitle={"Branding"}
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
