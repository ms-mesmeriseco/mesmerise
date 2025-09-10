"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";

import InView from "@/hooks/InView";
import ServicesList from "@/components/home/ServicesList";
import BlogThreeColumn from "@/components/cms-blocks/BlogThreeColumn";
import CollabModel from "@/components/home/CollabModel";
import ProjectGrid from "@/components/cms-blocks/ProjectGrid";
import useSectionMarker from "@/hooks/useSectionMarker";
import SectionMarker from "@/components/home/SectionMarker";
import StaggeredWords from "@/hooks/StaggeredWords";
import LoadingSplash from "@/components/home/LoadingSplash";
import Scene from "@/components/three/Scene";
import ProjectRail from "@/components/cms-blocks/ProjectRail";

// const Scene = dynamic(() => import("@/components/three/Scene"), {
//   ssr: false,
// });

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

  // 🔥 Do NOT set data-header-visible anymore
  return { dark: activated };
}

function Splash({ innerRef }) {
  return (
    <InView once={false}>
      <section
        ref={innerRef}
        id="home-scene"
        data-marker="HELLO"
        className="m-0 p-0 md:h-screen h-[80vh] w-[100%]"
      >
        {/* <LoadingSplash /> */}

        <Scene />
      </section>
    </InView>
  );
}

function Statement({ innerRef }) {
  return (
    <section
      ref={innerRef}
      data-marker="WHAT WE DO"
      className="min-h-[70vh] flex items-center justify-center text-white"
    >
      <div className="max-w-[1200px]">
        <InView>
          <StaggeredWords
            as="h1"
            text="We craft brand, web, and content experiences that look sexy, and convert."
            className="page-title-large"
            margin="-40% 0px"
            once={false}
          />
        </InView>
      </div>
    </section>
  );
}

function SecondaryStatement() {
  useSectionMarker();
  return (
    <section
      data-marker="WHAT WE BRING"
      className="min-h-[70vh] flex items-center justify-center text-white"
    >
      <div className="max-w-[1200px] text-left text-balance">
        <StaggeredWords
          as="p"
          text="Bridging the gap between aesthetic solutions and undeniable data."
          className="page-title-large"
          margin="-40% 0px"
          once={false}
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
      <ProjectRail tag="highlight" />
    </section>
  );
}
function BlogsRow() {
  return (
    <section
      data-marker="WHAT WE KNOW"
      className="relative py-12 md:py-16 text-white"
    >
      <BlogThreeColumn />
    </section>
  );
}

function ServicesSection() {
  return (
    <section data-marker="Services" className="text-white">
      <ServicesList />
    </section>
  );
}

export default function HomePage() {
  const splashRef = useRef(null);
  const section2Ref = useRef(null);
  const { dark } = usePageStageController(splashRef, section2Ref);
  const marker = useSectionMarker();

  return (
    <main
      className={[
        "relative min-h-screen text-white transition-colors duration-700 p-[var(--global-margin-md)]",
        dark ? "bg-black" : "bg-black",
      ].join(" ")}
    >
      <SectionMarker label={marker} />

      <Splash innerRef={splashRef} label="Mmm" />

      <Statement innerRef={section2Ref} label="what we're about" />

      <InView>
        <ProjectsRow />
      </InView>
      <SecondaryStatement />
      <InView once={false}>
        <CollabModel />
      </InView>
      <ServicesSection />

      {/* <BlogsRow /> */}
    </main>
  );
}
