"use client";

import { useEffect, useState } from "react";
import PageTitleLarge from "../layout/PageTitleLarge";
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

// ✅ Simple custom hook
function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
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
        <div>
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
  heroMobile,
  serviceTags,
  para1Content,
  processSteps,
  para2Content,
  para3Content,
  customBlock,
  finalCTA,
  servicesFAQ,
}) {
  const isMobile = useIsMobile(600);
  const displayMedia = isMobile && heroMobile ? heroMobile : heroMedia;

  return (
    <div className="flex flex-col gap-8">
      <section className="max-h-full flex items-center justify-center">
        {displayMedia ? (
          isVideo(displayMedia) ? (
            <video
              src={displayMedia}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full md:aspect-16/9 aspect-9/16 pt-0 object-cover"
            />
          ) : (
            <img
              src={displayMedia}
              alt="Hero Media"
              className="w-full h-full md:aspect-16/9 aspect-9/16 pt-0 object-cover"
            />
          )
        ) : null}
      </section>

      <PageTitleLarge text={heroTitle} />
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
        items={servicesFAQ}
        singleOpen={false}
        defaultOpen={[0]}
      />
      <ServicesRail tag="all" />
    </div>
  );
}
