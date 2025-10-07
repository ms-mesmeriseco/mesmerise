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
  const title = "Performance & Growth Marketing | Mesmerise Digital";
  const description =
    "We blend data, psychology and strategy to generate qualified traffic, lower CPA, and scale with integrity.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.mesmeriseco.com/services/performance-growth`,
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
