"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import InView from "@/hooks/InView";
import dynamic from "next/dynamic";
import ImpactStatsMobile from "@/components/home/ImpactStatsMobile";
import ServicesRail from "@/components/services/ServicesRail";
import HeroButton from "@/components/ui/HeroButton";
import StaggeredWords from "@/hooks/StaggeredWords";
import TeamBlock from "@/components/about/TeamBlock";
import TrustedBy from "@/components/home/TrustedBy";
import TestimonialsRail from "@/components/home/TestimonialRail";
import Statement from "@/components/layout/Statement";
import CaseStudyHero from "@/components/sanity-blocks/CaseStudyHero";
import InViewTheme from "@/hooks/InViewTheme";

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
  heading: "The Sauna Company",
  logo: "https://cdn.sanity.io/images/wpr5jlmc/production/eccddb9def0b9cd61a9e72e70f9899723bbf3fb0-564x123.png", // or a full URL string
  heroImage:
    "https://cdn.sanity.io/images/wpr5jlmc/production/732f9b7be4430aa864f46a98bcd6f7d6ed97a6e3-2048x1365.jpg", // or a full URL string
  button1: {
    label: "Read Case Study",
    link: "https://www.mesmeriseco.com/work/the-sauna-company",
  },
  button2: {
    label: "Let's Chat",
    link: "https://www.mesmeriseco.com/connect",
  },
  stats: [
    { _key: "stat1", value: "1670%", label: "Increase in online enquiries" },
    { _key: "stat2", value: "50%", label: "Increase in phone call enquiries" },
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
        className=" fade-in relative h-[95vh] w-full overflow-hidden border-b-1 border-[var(--mesm-grey-dk)] mb-2"
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
    <section className="min-h-screen flex items-center justify-center px-6 text-[var(--foreground)] ">
      <div className="max-w-[1200px] text-center text-balance">
        <StaggeredWords
          as="p"
          text={text}
          className="page-title-large"
          margin="-40% 0px"
        />
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
        "relative min-h-screen text-white transition-colors duration-200 flex flex-col gap-4",
      ].join(" ")}
    >
      <Splash innerRef={splashRef} />

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

      <InView>
        <div className="flex flex-col items-center justify-center">
          <CaseStudyHero narrow={false} block={caseStudyBlock} />
        </div>
      </InView>
      <TrustedBy />

      <TeamBlock
        heading6="Who we are"
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

      <InViewTheme
        as="section"
        theme={{
          "--background": "var(--mesm-red)",
          "--foreground": "#ffffff",
        }}
      >
        <div className=" flex items-center ">
          <TestimonialsRail />
        </div>
      </InViewTheme>
      <ServicesRail />
      <CollabModel />

      <SecondaryStatement
        text="Let's create something that looks sexy, and converts."
        cta="Book a consultation"
      />
    </main>
  );
}
