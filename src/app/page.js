"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import InView from "@/hooks/InView";
import StaggeredWords from "@/hooks/StaggeredWords";
import dynamic from "next/dynamic";
import ImpactStatsMobile from "@/components/home/ImpactStatsMobile";
import ServicesRail from "@/components/services/ServicesRail";

const Scene = dynamic(() => import("@/components/three/Scene"), { ssr: false });
const ProjectRail = dynamic(
  () => import("@/components/cms-blocks/ProjectRail"),
  { suspense: true }
);
const ImpactStats = dynamic(() => import("@/components/home/ImpactStats"), {
  suspense: true,
});
const CollabModel = dynamic(() => import("@/components/home/CollabModel"), {
  suspense: true,
});

// Page stage controller: tracks which section we're in, for background color changes

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
  const videoRef = useRef(null);
  const inView = useInView(innerRef, { amount: 0.35 });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) {
      // try to play; ignore promise errors (iOS may block until user gesture)
      v.play?.().catch(() => {});
    } else {
      v.pause?.();
    }
  }, [inView]);

  return (
    // <InView once={true} margin="-60% 0px -60% 0px">
    <section
      ref={innerRef}
      id="home-scene"
      data-marker="HELLO"
      className="fade-in relative h-[90vh] w-full border-b pb-36 mb-12 border-[var(--mesm-grey-dk)] overflow-hidden"
    >
      {/* Mobile: video */}
      <div className="md:hidden absolute inset-0 width-3/4 flex items-center justify-center h-[80vh]">
        <video
          ref={videoRef}
          className="h-auto w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        >
          {/* Provide both for best compatibility (webm first if you have it) */}

          <source src="/assets/mesm_logo_video.mp4" type="video/mp4" />
        </video>
        {/* Optional subtle overlay to match your scene look */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* Tablet/Desktop: 3D scene */}
      <div className="hidden md:block absolute inset-0">
        <Scene
          onLoaded={() => {
            /* keep if you still use the notifier */
          }}
        />
      </div>
    </section>
    // </InView>
  );
}

function Statement({ innerRef }) {
  return (
    <section
      ref={innerRef}
      data-marker="WHAT WE DO"
      className="min-h-[50vh] flex items-start justify-center text-white"
    >
      <div>
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
      <div>
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

export default function HomePage() {
  const splashRef = useRef(null);
  const section2Ref = useRef(null);
  const { dark } = usePageStageController(splashRef, section2Ref);

  return (
    <main
      className={[
        "relative min-h-screen text-white transition-colors duration-700 p-[var(--global-margin-md)]",
        dark ? "bg-black" : "bg-black",
      ].join(" ")}
    >
      <Splash innerRef={splashRef} />
      <Statement innerRef={section2Ref} />
      <ProjectsRow />
      <SecondaryStatement />
      <div className="md:hidden">
        <ImpactStatsMobile />
      </div>
      <div className="md:block  hidden">
        <ImpactStats />
      </div>

      <CollabModel />
      <ServicesRail />
    </main>
  );
}
