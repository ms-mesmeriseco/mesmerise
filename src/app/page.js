"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import InView from "@/hooks/InView";
import StaggeredWords from "@/hooks/StaggeredWords";
import dynamic from "next/dynamic";
import useLowEndDevice from "@/hooks/useLowEndDevice";
import SceneFallback from "@/components/home/SceneFallback";
import ImpactStatsMobile from "@/components/home/ImpactStatsMobile";
import ServicesRail from "@/components/services/ServicesRail";

const Scene = dynamic(() => import("@/components/three/Scene"), { ssr: false });
const ProjectRail = dynamic(
  () => import("@/components/cms-blocks/ProjectRail"),
  { suspense: true }
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
  const lowEnd = useLowEndDevice();
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(lowEnd);
  const [allow3D, setAllow3D] = useState(!lowEnd);

  // give the scene a brief window to load before falling back (non–low-end)
  useEffect(() => {
    if (lowEnd) return;
    const t = setTimeout(() => {
      if (!sceneLoaded) setShowFallback(true);
    }, 2000);
    return () => clearTimeout(t);
  }, [sceneLoaded, lowEnd]);

  const handleEnable3D = () => {
    setAllow3D(true);
    setShowFallback(true);
  };

  const handleSceneLoaded = () => {
    setSceneLoaded(true);
    setShowFallback(false);
  };

  return (
    <InView once={true} margin="-60% 0px -60% 0px">
      <section
        ref={innerRef}
        id="home-scene"
        data-marker="HELLO"
        className="relative h-[100vh] w-[100%] border-b pb-36 mb-12 border-[var(--mesm-grey-dk)] overflow-hidden"
      >
        {/* {showFallback && (
          <div className="absolute inset-0 z-10">
            <SceneFallback
              showEnableButton={lowEnd && !sceneLoaded && !allow3D}
              onEnable3D={lowEnd ? handleEnable3D : undefined}
            />
          </div>
        )}

        {allow3D && <Scene onLoaded={handleSceneLoaded} />} */}
        <Scene onLoaded={handleSceneLoaded} />
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
