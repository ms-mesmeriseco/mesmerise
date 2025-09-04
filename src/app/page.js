"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import InView from "@/hooks/InView";
import ServicesList from "@/components/home/ServicesList";
import BlogThreeColumn from "@/components/cms-blocks/BlogThreeColumn";
import CollabModel from "@/components/home/CollabModel";
import ProjectGrid from "@/components/cms-blocks/ProjectGrid";
import useSectionMarker from "@/hooks/useSectionMarker";
import SectionMarker from "@/components/home/SectionMarker";
import Scene from "@/components/three/Scene";
import StaggeredWords from "@/hooks/StaggeredWords";
import PageTitleLarge from "@/components/layout/PageTitleLarge";

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

  // Header visibility = NOT seeing Splash
  const headerVisible = splashInView === false;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute(
        "data-header-visible",
        headerVisible ? "true" : "false"
      );
    }
  }, [headerVisible]);

  return { dark: activated, headerVisible };
}

function Splash({ innerRef }) {
  return (
    <section
      ref={innerRef}
      data-marker="HELLO"
      className="m-0 p-0 h-[100vh] w-[100%]"
    >
      <Scene />
    </section>
  );
}

function Statement({ innerRef }) {
  return (
    <section
      ref={innerRef}
      data-marker="WHAT WE DO"
      className="min-h-screen flex items-center justify-center px-6 text-white"
    >
      <div className="max-w-[1200px] text-center">
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
  useSectionMarker();
  return (
    <section
      data-marker="WHAT WE BRING"
      className="min-h-[70vh] flex items-center justify-center px-6 text-white"
    >
      <div className="max-w-[1200px] text-center text-balance">
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
      <ProjectGrid />
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
        "relative min-h-screen text-white transition-colors duration-700 px-8",
        dark ? "bg-black" : "bg-[var(--mesm-red)]",
      ].join(" ")}
    >
      <SectionMarker label={marker} />

      <Splash innerRef={splashRef} label="Mmm" />

      <Statement innerRef={section2Ref} label="what we're about" />

      <InView>
        <ProjectsRow />
      </InView>
      <SecondaryStatement />
      <InView>
        <CollabModel />
      </InView>
      <ServicesSection />

      {/* <BlogsRow /> */}
    </main>
  );
}
