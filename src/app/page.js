"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import InView from "@/hooks/InView";
import dynamic from "next/dynamic";
import ImpactStatsMobile from "@/components/home/ImpactStatsMobile";
import ServicesRail from "@/components/services/ServicesRail";
import HeroButton from "@/components/ui/HeroButton";
import StaggeredWords from "@/hooks/StaggeredWords";
import TrustedBy from "@/components/home/TrustedBy";
import TestimonialsRail from "@/components/home/TestimonialRail";
import Statement from "@/components/layout/Statement";
import { useHeroLoader } from "@/components/three/HeroLoaderProvider";

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

const caseStudyBlock = {
  eyebrow: "Gondwana Landscaping & Stone",
  heading: "Closing the loop on complex sales cycles",
  logo: "https://cdn.sanity.io/images/wpr5jlmc/production/dcfd51ef54e1020d9825d6074224b34e861c3f95-220x87.webp", // or a full URL string
  heroImage:
    "https://cdn.sanity.io/images/wpr5jlmc/production/55f7829c681fd2d83a9b7de61c57db112dcfffe6-1920x2560.jpg", // or a full URL string
  button1: {
    label: "Read Case Study",
    link: "https://www.mesmeriseco.com/work/gondwana-landscaping-and-stone",
  },
  button2: {
    label: "Let's Chat",
    link: "https://www.mesmeriseco.com/connect",
  },
  stats: [
    { _key: "stat1", value: "5+", label: "New staff" },
    { _key: "stat2", value: "6 months", label: "Booked out in advance" },
  ],
};

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
function ThreeScene({ innerRef, sceneReady }) {
  const videoRef = useRef(null);
  const inView = useInView(innerRef, { amount: 0.35 });
  const { setSceneReady } = useHeroLoader();

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
    <>
      <InView once={true}>
        <section
          ref={innerRef}
          id="home-scene"
          className="fade-in relative h-[95vh] w-full overflow-hidden border-b-1 border-[var(--mesm-grey-dk)] mb-2"
        >
          {/* Mobile: video */}
          {/* <div
            onLoad={() => {
              setSceneReady(true);
            }}
            className="md:hidden absolute inset-0 width-3/4 flex items-center justify-center h-[80vh]"
          >
            <video
              ref={videoRef}
              className="h-auto w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
  

              <source src="/assets/mesm_logo_video.mp4" type="video/mp4" />
            </video>
     
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div> */}

          {/* Tablet/Desktop: 3D scene */}
          {/* <div className="absolute inset-0"> */}
          <Scene
            onLoaded={() => {
              setSceneReady(true);
            }}
          />
          {/* </div> */}
        </section>
      </InView>
    </>
  );
}

function ProjectsRow() {
  return (
    <section className="relative text-[var(--foreground)] ">
      <InView>
        <ProjectRail tag="highlight" />
      </InView>
    </section>
  );
}

function SecondaryStatement({ text, cta }) {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-6 text-[var(--foreground)] ">
      <div className="max-w-[1200px] text-center text-balance">
        <StaggeredWords as="p" text={text} className="page-title-large" />
        {cta ? (
          <>
            <br />
            <br />
            <br />
            <HeroButton size="lg" href="/connect">
              {cta}
            </HeroButton>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default function HomePage() {
  const splashRef = useRef(null);

  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { amount: 0.2 });

  useEffect(() => {
    if (testimonialsInView) {
      document.body.classList.add("testimonials-active");
    } else {
      document.body.classList.remove("testimonials-active");
    }
  }, [testimonialsInView]);

  return (
    <main
      className={[
        "relative min-h-screen text-white transition-colors duration-200 flex flex-col gap-2",
      ].join(" ")}
    >
      {/* Scene fixed to viewport — always behind everything */}
      {/* <div className="fixed inset-0 z-0"> */}
      <ThreeScene innerRef={splashRef} />
      {/* </div> */}

      {/* Scrollable content sits on top */}
      {/* <div className="relative z-10 flex flex-col gap-2"> */}
      {/* First section is transparent — "hero" viewport reveals the scene */}
      {/* <div className="h-screen" /> */}

      <Statement text="Mesmerise crafts brand, web, and content experiences that look sexy, and convert." />

      <ProjectsRow />

      <Statement
        text="Bridging the gap between aesthetic solutions and undeniable data."
        showCTA="true"
      />

      <div className="md:hidden ">
        <ImpactStatsMobile />
      </div>

      <div className="md:block  hidden ">
        <ImpactStats />
      </div>

      {/* <InView>
        <div className="flex flex-col items-center justify-center ">
          <CaseStudyHero narrow={false} block={caseStudyBlock} />
        </div>
      </InView> */}
      <ServicesRail />

      <TrustedBy />

      {/* <InViewTheme
        as="section"
        theme={{
          "--background": "#1c1c24",
          "--foreground": "#ffffff",
        }}
      > */}
      <div className=" flex items-center ">
        <TestimonialsRail />
      </div>
      {/* </InViewTheme> */}

      <CollabModel />

      <SecondaryStatement
        text="For businesses who think exponentially."
        cta="Let's connect"
      />
      {/* </div> */}
    </main>
  );
}
