// app/services/website/page.jsx
import ServicesHero from "@/components/services/ServicesHero.jsx";
import ProcessBubbles from "@/components/services/ProcessBubbles";

import {
  heroMedia,
  trustBadgeText,
  trustBadgeLogos,
  column1Content,
  column2Content,
  serviceTags,
  processSteps,
} from "./content.jsx";

export default function WebsitePage() {
  return (
    <>
      <div className=" p-[var(--global-margin-lg)]">
        <ServicesHero
          heroMedia={heroMedia}
          trustBadgeText={trustBadgeText}
          trustBadgeLogos={trustBadgeLogos}
          column1Content={column1Content}
          column2Content={column2Content}
          serviceTags={serviceTags}
          // You can still pass processSteps here if your ServicesPage uses HorizontalAccordion.
          // We’re rendering ProcessBubbles below instead.
        />

        {/* Full-width row of process bubbles */}
        <div className="w-full py-12">
          <ProcessBubbles items={processSteps} />
        </div>
      </div>
    </>
  );
}
