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

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.mesmeriseco.com/services/website`,
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
