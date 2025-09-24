"use client";

import ServicePageBase from "@/components/services/ServicePageBase.jsx";

import {
  heroMedia,
  para1Content,
  para2Content,
  para3Content,
  serviceTags,
  processSteps,
  finalCTA,
  servicesFAQ,
} from "./content.jsx";

export default function BrandingPage() {
  return (
    <>
      <ServicePageBase
        heroTitle={"Branding"}
        heroMedia={heroMedia}
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
