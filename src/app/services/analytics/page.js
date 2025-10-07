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
    "Analytics and Insights for Smarter Decisions | Mesmerise Digital";
  const description =
    "When your data speaks with one voice, decisions become clear. We turn analytics into strategy that drives undeniable results.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.mesmeriseco.com/services/analytics`,
    },
  };
}

export default function AnalyticsPage() {
  return (
    <>
      <ServicePageBase
        heroTitle={"Analytics"}
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
