"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

import InView from "@/hooks/InView";
import StaggeredWords from "@/hooks/StaggeredWords";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
});
const ProjectRail = dynamic(
  () => import("@/components/cms-blocks/ProjectRail"),
  {
    suspense: true,
  }
);
const ServicesList = dynamic(() => import("@/components/home/ServicesList"), {
  suspense: true,
});

const ImpactStats = dynamic(() => import("@/components/home/ImpactStats"), {
  suspense: true,
});
const CollabModel = dynamic(() => import("@/components/home/CollabModel"), {
  suspense: true,
});

function usePageStageController(splashRef, section2Ref) {
  const splashInView = useInView(splashRef, { amount: 0.2 });
  const hitSection2 = useInView(section2Ref, { amount: 0.2 });
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (
      hitSection2 ||
      (typeof window !== "undefined" && splashInView === false)
    ) {
      setActivated(true);
    } else if (!hitSection2 && splashInView === true) {
      setActivated(false);
    }
  }, [hitSection2, splashInView]);

  return { dark: activated };
}

function Splash({ innerRef }) {
  const [sceneLoaded, setSceneLoaded] = useState(false);
  return (
    <InView once={true} margin="-60% 0px -60% 0px">
      <section
        ref={innerRef}
        id="home-scene"
        data-marker="HELLO"
        className="h-screen w-[100%] border-b pb-36 mb-12 border-[var(--mesm-grey-dk)]"
      >
        {/* <LoadingSplash isSceneLoaded={sceneLoaded} /> */}

        <Scene onLoaded={setSceneLoaded} />
      </section>
    </InView>
  );
}

function Statement({ innerRef }) {
  return (
    <section
      ref={innerRef}
      data-marker="WHAT WE DO"
      className="min-h-[50vh] flex items-start justify-center text-white"
    >
      <div className="">
        <InView>
          <StaggeredWords
            as="h1"
            text="We craft brand, web, and content experiences that look sexy, and convert."
            className="page-title-large"
            margin="-40% 0px"
          />
        </InView>
      </div>
    </section>
  );
}

function SecondaryStatement() {
  return (
    <section
      data-marker="WHAT WE BRING"
      className="min-h-[50vh] flex items-start justify-center text-white"
    >
      <div className="">
        <StaggeredWords
          as="p"
          text="Bridging the gap between aesthetic solutions and undeniable data."
          className="page-title-large"
          margin="-40% 0px"
        />
      </div>
    </section>
  );
}

function ProjectsRow() {
  return (
    <section
      data-marker="How it looks"
      className="relative py-12 md:py-16 text-white"
    >
      <InView>
        <ProjectRail tag="highlight" />
      </InView>
    </section>
  );
}

function ServicesSection() {
  return (
    <section data-marker="Services" className="text-white">
      <InView>
        <ServicesList />
      </InView>
    </section>
  );
}

export default function HomePage() {
  const splashRef = useRef(null);
  const section2Ref = useRef(null);
  const { dark } = usePageStageController(splashRef, section2Ref);
  // const marker = useSectionMarker();

  return (
    <main
      className={[
        "relative min-h-screen text-white transition-colors duration-700 p-[var(--global-margin-md)]",
        dark ? "bg-black" : "bg-black",
      ].join(" ")}
    >
      <Splash innerRef={splashRef} label="Mmm" />
      <Statement innerRef={section2Ref} label="what we're about" />
      <ProjectsRow />
      <SecondaryStatement />
      <ImpactStats />
      <CollabModel />
      <ServicesSection />
    </main>
  );
}
