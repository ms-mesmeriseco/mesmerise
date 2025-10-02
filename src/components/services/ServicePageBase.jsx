"use client";

import ServicesHero from "@/components/services/ServicesHero.jsx";
import ProcessBubbles from "@/components/services/ProcessBubbles";
import StaggeredWords from "@/hooks/StaggeredWords";
import CollabModel from "../home/CollabModel";
import InView from "@/hooks/InView";
import Button from "@/components/ui/Button";
import ServiceTags from "./ServiceTags";
import ServicesRail from "./ServicesRail";
import FAQ from "@/components/layout/FAQ.jsx";

function isVideo(src) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

function IntroPara({ text }) {
  return (
    <section className="flex items-center justify-left text-white min-h-[70vh] md:max-w-3/4">
      <div className="text-left">
        <InView>
          <StaggeredWords
            as="h2"
            text={text}
            className="page-title-medium"
            margin="-40% 0px"
          />
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
          <StaggeredWords
            as="h2"
            text={text}
            className="page-title-medium"
            margin="-40% 0px"
          />
        </InView>
      </div>
    </section>
  );
}
function ThirdPara({ text }) {
  return (
    <section className="flex items-center justify-center text-white min-h-[70vh] md:w-3/4">
      <div className="text-left">
        <InView>
          <StaggeredWords
            as="h2"
            text={text}
            className="page-title-medium"
            margin="-40% 0px"
          />
        </InView>
      </div>
    </section>
  );
}

function FinalCTA({ text }) {
  return (
    <InView>
      <section className="flex flex-col justify-left text-white pb-4">
        <div className="">
          <StaggeredWords
            as="h3"
            text={text}
            className="page-title-large"
            margin="-40% 0px"
          />
          <br />
          <br />
          <br />
        </div>

        <div className="text-right pt-6">
          <Button size="x-large" variant="accent2" href="/connect">
            Let's Talk
          </Button>
        </div>
      </section>
    </InView>
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
  finalCTA,
  servicesFAQ,
}) {
  return (
    <>
      <div className="md:p-[var(--global-margin-lg)] p-[var(--global-margin-sm)]  flex flex-col gap-8">
        <section className="max-h-full flex items-center justify-center">
          {heroMedia ? (
            isVideo(heroMedia) ? (
              <video
                src={heroMedia}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full md:aspect-16/9 pt-4 md:pt-0 aspect-5/6 object-cover "
              />
            ) : (
              <img
                src={heroMedia}
                alt="Hero Media"
                className="w-full h-full md:aspect-16/9 pt-4 md:pt-0 aspect-5/6 object-cover "
              />
            )
          ) : null}
        </section>
        <ServicesHero heroTitle={heroTitle} />
        <IntroPara text={para1Content} />
        <div>
          <div className="border-b-1 border-[var(--mesm-grey-dk)] py-2 w-full ">
            <h6>What we offer</h6>
          </div>
        </div>
        <ServiceTags items={serviceTags} />

        <SecondPara text={para2Content} />

        <ProcessBubbles items={processSteps} />
        <div>{customBlock}</div>
        <ThirdPara text={para3Content} />
        <CollabModel />
        <FinalCTA text={finalCTA} />
        <FAQ
          label="common questions"
          title="Frequently asked questions"
          items={servicesFAQ} // your array of { question, textContent }
          singleOpen={false} // set true to allow only one open at a time
          defaultOpen={[0]} // which indexes start open
        />
        <ServicesRail tag="all" />
      </div>
    </>
  );
}
