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
  const title =
    "Growth Strategy That Turns Data Into Direction | Mesmerise Digital";
  const description =
    "We craft strategic systems that unify psychology, positioning and analytics to create clarity, precision and measurable growth.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.mesmeriseco.com/services/strategy`,
    },
  };
}

export default function StrategyPage() {
  return (
    <>
      <ServicePageBase
        heroTitle={"Strategy"}
        heroMedia={heroMedia}
        heroMobile={heroMobile}
        serviceTags={serviceTags}
        para1Content={para1Content[0]}
        para2Content={para2Content}
        para3Content={para3Content}
        processSteps={processSteps}
        finalCTA={finalCTA}
        servicesFAQ={servicesFAQ}
      />
    </>
  );
}
