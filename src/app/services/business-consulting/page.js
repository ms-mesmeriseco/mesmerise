"use client";

import ServicePageBase from "@/components/services/ServicePageBase.jsx";
import PackagesRow from "@/components/services/PackagesRow.jsx";

import {
  heroMedia,
  trustBadgeText,
  trustBadgeLogos,
  column1Content,
  column2Content,
  serviceTags,
  processSteps,
} from "./content.jsx";

export default function ConsultingPage() {
  return (
    <>
      <ServicePageBase
        heroTitle={"Business & Consulting"}
        heroMedia={heroMedia}
        trustBadgeText={trustBadgeText}
        trustBadgeLogos={trustBadgeLogos}
        serviceTags={serviceTags}
        paraContent1={column1Content}
        processSteps={processSteps}
        paraContent2={column2Content}
        customBlock={<PackagesRow />}
      />
    </>
  );
}
