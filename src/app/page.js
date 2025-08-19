"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import ServicesList from "@/components/home/ServicesList";
import BlogScroll from "@/components/cms-blocks/BlogScroll";
import CollabModel from "@/components/home/CollabModel";
import ProjectScroll from "@/components/cms-blocks/ProjectScroll";
import useSectionMarker from "@/hooks/useSectionMarker";
import SectionMarker from "@/components/home/SectionMarker";
import Scene from "@/components/three/Scene";
import StaggeredWords from "@/hooks/StaggeredWords";
// ---------- Utility: split text and stagger words ----------

// ---------- Hook: toggle <html data-header-visible> & background color ----------
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

// ---------- Splash (Section 1) ----------
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
        <StaggeredWords
          as="h1"
          text="We craft brand, web, and content experiences which look sexy, and convert."
          className="page-title-large leading-[0.95]"
        />
      </div>
    </section>
  );
}

function SecondaryStatement() {
  useSectionMarker();
  return (
    <section
      data-marker="WHO WE ARE"
      className="min-h-[70vh] flex items-center justify-center px-6 text-white"
    >
      <div className="max-w-[900px] text-center text-balance">
        <StaggeredWords
          as="p"
          text="We partner with founders and marketing teams across the East Coast to ship high-velocity creative: identity systems, bleeding-edge websites, and content that converts."
          className="page-title-large text-2xl md:text-4xl leading-tight"
        />
      </div>
    </section>
  );
}

function ProjectsRow() {
  return (
    <section
      data-marker="RESULTS"
      className="relative py-12 md:py-16 text-white"
    >
      <ProjectScroll />
    </section>
  );
}
function BlogsRow() {
  return (
    <section data-marker="BLOG" className="relative py-12 md:py-16 text-white">
      <BlogScroll />
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

      <Splash innerRef={splashRef} label="HELLO" />

      <Statement innerRef={section2Ref} label="what we're about" />
      <ProjectsRow />

      <SecondaryStatement />

      <CollabModel />

      <ServicesSection />

      <BlogsRow />
    </main>
  );
}
