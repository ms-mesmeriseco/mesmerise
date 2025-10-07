"use client";

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

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.mesmeriseco.com/services/branding`,
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
