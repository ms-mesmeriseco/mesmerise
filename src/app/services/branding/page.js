"use client";

import ServicePageBase from "@/components/services/ServicePageBase.jsx";
import PackagesRow from "@/components/services/PackagesRow.jsx";

import {
  heroMedia,
  para1Content,
  para2Content,
  para3Content,
  serviceTags,
  processSteps,
  PACKAGES,
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
        customBlock={<PackagesRow packageData={PACKAGES} />}
      />
    </>
  );
}
