"use client";

import ServicesHero from "@/components/services/ServicesHero.jsx";
import ProcessBubbles from "@/components/services/ProcessBubbles";
import StaggeredWords from "@/hooks/StaggeredWords";
import CollabModel from "../home/CollabModel";
import InView from "@/hooks/InView";
import SecondaryButton from "@/components/ui/SecondaryButton";

function IntroPara({ text }) {
  return (
    <section className="flex items-center justify-left text-white min-h-[70vh] md:max-w-3/4">
      <div className="text-left">
        <InView>
          <StaggeredWords as="h2" text={text} className="page-title-medium" />
        </InView>
      </div>
    </section>
  );
}

function SecondPara({ text }) {
  return (
    <section className="flex items-center justify-right ml-auto text-white min-h-[70vh] md:max-w-3/4">
      <div className="text-left">
        <InView>
          <StaggeredWords as="h2" text={text} className="page-title-medium" />
        </InView>
      </div>
    </section>
  );
}
function ThirdPara({ text }) {
  return (
    <section className="flex items-center justify-center text-white min-h-[70vh] md:w-3/4 px-6">
      <div className="text-left">
        <InView>
          <StaggeredWords as="h2" text={text} className="page-title-medium" />
        </InView>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="flex items-center justify-center text-white min-h-[70vh]">
      <div className="text-center">
        <InView>
          <StaggeredWords
            as="h2"
            text="There’s only one way to find out if we have what it takes (pssst it involves getting in touch...)"
            className="page-title-large md:px-18"
          />
          <br />
          <br />
          <br />
          <SecondaryButton size="x-large">Say Hi</SecondaryButton>
        </InView>
      </div>
    </section>
  );
}

export default function ServicePageBase({
  heroTitle,
  heroMedia,
  serviceTags,
  para1Content,
  processSteps,
  para2Content,
  para3Content,
  customBlock,
}) {
  return (
    <>
      <div className="p-[var(--global-margin-lg)] flex flex-col gap-8">
        <ServicesHero
          heroMedia={heroMedia}
          heroTitle={heroTitle}
          serviceTags={serviceTags}
        />
        <IntroPara text={para1Content} />

        {/* Full-width row of process bubbles */}
        <div className="w-full">
          <ProcessBubbles items={processSteps} />
        </div>

        <SecondPara text={para2Content} />

        <div>{customBlock}</div>
        <ThirdPara text={para3Content} />
        <CollabModel />
        <FinalCTA />
      </div>
    </>
  );
}
