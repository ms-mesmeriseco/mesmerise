"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useInView } from "framer-motion";
import InView from "@/hooks/InView";
import StaggeredWords from "@/hooks/StaggeredWords";
import dynamic from "next/dynamic";
import ImpactStatsMobile from "@/components/home/ImpactStatsMobile";
import ServicesRail from "@/components/services/ServicesRail";
import HeroButton from "@/components/ui/HeroButton";
import TeamBlock from "@/components/about/TeamBlock";
import TrustedBy from "@/components/home/TrustedBy";
import TestimonialsRail from "@/components/home/TestimonialRail";

const Scene = dynamic(() => import("@/components/three/Scene"), { ssr: false });
const ProjectRail = dynamic(
  () => import("@/components/sanity-blocks/ProjectRail"),
  { suspense: true },
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
    <InView once={true}>
      <section
        ref={innerRef}
        id="home-scene"
        className="fade-in relative h-[80vh] w-full overflow-hidden"
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
    </InView>
  );
}

function Statement({ innerRef }) {
  return (
    <section
      ref={innerRef}
      className="min-h-[98vh] flex items-center justify-center text-white  border-b pb-36 mb-12 border-[var(--mesm-grey-dk)] "
    >
      <div>
        <InView>
          <StaggeredWords
            triggerOnLoad={true}
            as="h1"
            text="Mesmerise crafts brand, web, and content experiences that look sexy, and convert."
            className="page-title-large pb-6"
            // margin="-40% 0px"
          />
          <HeroButton href="/connect">Let's connect</HeroButton>
        </InView>
      </div>
    </section>
  );
}

function SecondaryStatement() {
  return (
    <section className="min-h-[50vh] flex items-start justify-center text-white">
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
    <section className="relative py-12 md:py-16 text-white">
      <InView>
        <ProjectRail tag="highlight" />
      </InView>
    </section>
  );
}

export default function HomePage() {
  const splashRef = useRef(null);
  const section2Ref = useRef(null);

  return (
    <main
      className={[
        "relative min-h-screen text-white transition-colors duration-700",
      ].join(" ")}
    >
      <Statement innerRef={section2Ref} />
      <Splash innerRef={splashRef} />

      <ProjectsRow />
      <SecondaryStatement />
      <div className="md:hidden">
        <ImpactStatsMobile />
      </div>
      <div className="md:block  hidden">
        <ImpactStats />
      </div>
      <TeamBlock
        heading="Our team"
        team={[
          {
            id: "1",
            name: "Petar Petrović",
            title: "Founder",
            photo: {
              url: "/assets/team/Petar.jpg",
              alt: "Petar Petrovic portrait",
            },
          },
          {
            id: "2",
            name: "Matilda Sutherland",
            title: "Design & Development",
            photo: {
              url: "/assets/team/Matilda.jpg",
            },
          },
          {
            id: "3",
            name: "Simba Dhaliwal",
            title: "Business Development",
            photo: {
              url: "/assets/team/Simba.jpg",
            },
          },
          {
            id: "4",
            name: "Nicole Uren",
            title: "Digital Marketing Strategist",
            photo: {
              url: "/assets/team/Nicole.jpg",
            },
          },
        ]}
      />
      <TrustedBy />
      <TestimonialsRail />
      <CollabModel />
      <ServicesRail />
    </main>
  );
}
