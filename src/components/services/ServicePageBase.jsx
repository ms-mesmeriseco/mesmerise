"use client";

import ServicesHero from "@/components/services/ServicesHero.jsx";
import ProcessBubbles from "@/components/services/ProcessBubbles";
import StaggeredWords from "@/hooks/StaggeredWords";
import CollabModel from "../home/CollabModel";
import InView from "@/hooks/InView";
import Button from "@/components/ui/Button";
import ServiceTags from "./ServiceTags";

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
    <section className="flex items-center justify-center text-white min-h-[70vh] md:w-3/4 px-6">
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
    <section className="flex justify-center text-white border-b-1 border-[var(--mesm-grey-dk)] pb-4">
      <div className="">
        <InView>
          <StaggeredWords
            as="h2"
            text={text}
            className="page-title-large"
            margin="-40% 0px"
          />
          <br />
          <br />
          <br />

          <div className="ml-auto w-full">
            <a
              href="/connect"
              className="hover:text-[var(--accent)] duration-200 text-[var(--background)]  text-center"
            >
              <StaggeredWords
                as="h2"
                text="Say Hi"
                className="page-title-large bg-[var(--mesm-red)] hover:bg-[var(--mesm-yellow)] duration-200 w-fit"
                margin="-40% 0px"
              />
            </a>
            {/* <Button size="x-large" variant="primary" href="/connect">
              Say Hi
            </Button> */}
          </div>
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
  finalCTA,
}) {
  return (
    <>
      <div className="p-[var(--global-margin-lg)] flex flex-col gap-8">
        <section className="max-h-full flex items-center justify-center">
          {heroMedia ? (
            isVideo(heroMedia) ? (
              <video
                src={heroMedia}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full md:aspect-16/9 object-cover "
              />
            ) : (
              <img
                src={heroMedia}
                alt="Hero Media"
                className="w-full h-full  md:aspect-16/9 object-cover "
              />
            )
          ) : null}
        </section>
        <ServicesHero heroTitle={heroTitle} />
        <IntroPara text={para1Content} />
        <h6>What we offer</h6>

        <ServiceTags items={serviceTags} />

        <SecondPara text={para2Content} />
        <h6>Process</h6>
        <ProcessBubbles items={processSteps} />
        <div>{customBlock}</div>
        <ThirdPara text={para3Content} />
        <CollabModel />
        <FinalCTA text={finalCTA} />
      </div>
    </>
  );
}
