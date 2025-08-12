"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import ServicesList from "@/components/home/ServicesList";
import BlogScroll from "@/components/cms-blocks/BlogScroll";
import CollabModel from "@/components/home/CollabModel"
import ProjectScroll from "@/components/cms-blocks/ProjectScroll";
import useSectionMarker from "@/hooks/useSectionMarker";
import SectionMarker from "@/components/home/SectionMarker";
import FeaturedCaseStudy from "@/components/home/FeaturedCaseStudy";
// ---------- Utility: split text and stagger words ----------
function StaggeredWords({
  text,
  className = "",
  delay = 0,
  as: As = "h1",
  once = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once });
  const words = text.trim().split(/\s+/);

  return (
    <As className={className}>
      <span ref={ref} className="inline-block align-top">
        {words.map((w, i) => (
          <motion.span
            key={i}
            className="inline-block will-change-transform"
            initial={{ y: "0.6em", opacity: 0, filter: "blur(4px)" }}
            animate={inView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.5, delay: delay + i * 0.06, ease: [0.2, 0.65, 0.3, 0.9] }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </span>
    </As>
  );
}

// ---------- Hook: toggle <html data-header-visible> & background color ----------
function usePageStageController(splashRef, section2Ref) {
  // Background goes black when: you leave Splash OR you ever hit Section 2 (sticky).
  // Header shows ONLY when Splash is NOT in view (independent of sticky background).
  const splashInView = useInView(splashRef, { amount: 0.2 });
  const hitSection2 = useInView(section2Ref, { once: true, amount: 0.2 });
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (hitSection2 || (typeof window !== "undefined" && splashInView === false)) {
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
      className="min-h-screen relative flex items-center justify-center text-white"
      // Splash inherits the "red" from the main wrapper when dark=false
    >
      <div className="pointer-events-none select-none">
        {/* Replace with your real logo asset */}
        <div className="text-6xl md:text-8xl font-bold tracking-tight"><img className="w-[20vw]" src="/LogoMark.png"/></div>
      </div>
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
          text="We craft brand, web, and content experiences that feel inevitable."
          className="page-title-large leading-[0.95]"
        />
      </div>
    </section>
  );
}


function CaseStudy({
  imageSrc = "/placeholder/case-study.jpg",
  slug = "/projects/example-project",
  client = "Client Name",
  title = "Project Title",
}) {
  return (
    <section data-marker="LOOK" className="relative min-h-screen text-white">
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={`${title} — ${client}`}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative h-screen flex items-end justify-end p-6 md:p-10">
        <div className="max-w-[min(92vw,1200px)] w-full mx-auto flex items-end justify-end">
          <Link
            href={slug}
            className="text-xs md:text-sm uppercase tracking-wide underline underline-offset-4 decoration-white/60 hover:decoration-white transition"
          >
            View project
          </Link>
        </div>
      </div>
    </section>
  );
}

function SecondaryStatement() {
  useSectionMarker();
  return (
    <section data-marker="About" className="min-h-[70vh] flex items-center justify-center px-6 text-white">
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
    <section className="relative py-12 md:py-16 text-white">
      <ProjectScroll />
    </section>
  );
}


function ServicesSection() {
  return (
    <section aria-label="Services" className="text-white">
    
      <ServicesList />
    </section>
  );
}

function BlogShowcaseSection() {
  return (
    <section aria-label="Blog" className="text-white">
      <BlogScroll />
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

      <section data-marker="case study" className="px-8">
        <FeaturedCaseStudy slug="tom-peacock-personal-training" />
      </section>



      <SecondaryStatement />
            <ProjectsRow />
      <CollabModel />



      <ServicesSection />

      <BlogScroll />
    </main>
  );
}
