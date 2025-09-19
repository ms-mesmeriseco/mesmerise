"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";

import InView from "@/hooks/InView";
import ServicesList from "@/components/home/ServicesList";
import BlogThreeColumn from "@/components/cms-blocks/BlogThreeColumn";
import CollabModel from "@/components/home/CollabModel";
import useSectionMarker from "@/hooks/useSectionMarker";
import StaggeredWords from "@/hooks/StaggeredWords";
import Scene from "@/components/three/Scene";
import ProjectRail from "@/components/cms-blocks/ProjectRail";

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
  return (
    <InView once={true} margin="-60% 0px -60% 0px">
      <section
        ref={innerRef}
        id="home-scene"
        data-marker="HELLO"
        className="h-screen w-[100%] border-b pb-36 mb-12 border-[var(--mesm-grey-dk)]"
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
  useSectionMarker();
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

function ImpactStats() {
  const stats = [
    {
      title: "$10M+",
      sub: "Total client revenue",
      body: "Real results over the last 3 years. Money in the bank, not just numbers on a report.",
    },
    {
      title: "25X",
      sub: "Average ROAS",
      body: "Most of our clients see a 25X return on ad spend, with a few breaking records and hitting 100X. That means every time someone puts in $1 they get back $25. If you find a better investment let us know.",
    },
    {
      title: "3,000%",
      sub: "More website traffic",
      body: "From zero to hero. Some clients see a staggering 7,998% increase in traffic. That’s a lot of eyeballs.",
    },
    {
      title: "874%",
      sub: "Average enquiries increase",
      body: "No more waiting for the phone to ring. Clients move from chasing work to switching off the phone until they can hire more staff. At the top end, enquiries grew by 2,800%.",
    },
  ];

  const container = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.08 },
    },
  };

  return (
    <section
      data-marker="RESULTS"
      className="relative py-12 md:py-16 text-white h-[80vh]"
    >
      <motion.div
        variants={container}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[var(--global-margin-xs)] h-full"
      >
        {stats.map((s, idx) => (
          <StatCard key={idx} {...s} index={idx} />
        ))}
      </motion.div>
    </section>
  );
}

function StatCard({ title, sub, body, index }) {
  const ref = useRef(null);
  const rafRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const colors = [
    "bg-[var(--mesm-red)]",
    "bg-[var(--mesm-blue)]",
    "bg-[var(--mesm-yellow)]",
  ];

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    // Cursor position relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // rAF throttle for smoother updates
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setPos({ x, y }));
  };

  const handleEnter = () => setVisible(true);
  const handleLeave = () => setVisible(false);

  // Touch: tap to toggle, place near touch point
  const handleTouchStart = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const t = e.touches?.[0];
    const x = (t?.clientX ?? rect.left + rect.width / 2) - rect.left;
    const y = (t?.clientY ?? rect.top + rect.height / 2) - rect.top;
    setPos({ x, y });
    setVisible((v) => !v);
  };

  return (
    <motion.article
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      onTouchStart={handleTouchStart}
      className="relative flex flex-col justify-between  border border-[var(--mesm-grey-dk)] rounded-lg p-6 md:p-7 flex flex-col gap-3 bg-black/20 hover:bg-white/5 transition-colors cursor-default"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <StaggeredWords
        as="h3"
        className="font-semibold leading-tight page-title-xl"
        text={title}
      />
      <p className="text-base md:text-lg opacity-80">{sub}</p>

      {/* Tooltip: top-left corner pinned to cursor */}

      {visible && (
        <motion.div
          role="tooltip"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={`pointer-events-none absolute z-10 w-86 max-w-[85%] rounded-2xl border border-[var(--mesm-grey-dk)] bg-[var(--mesm-blue)] px-3 py-1 shadow-md backdrop-blur-sm`}
          style={{ left: pos.x, top: pos.y }}
        >
          <p className="p3 opacity-90 text-[var(--background)]">{body}</p>
        </motion.div>
      )}
    </motion.article>
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
  // const marker = useSectionMarker();

  return (
    <main
      className={[
        "relative min-h-screen text-white transition-colors duration-700 p-[var(--global-margin-md)]",
        dark ? "bg-black" : "bg-black",
      ].join(" ")}
    >
      {/* <SectionMarker label={marker} /> */}

      <Splash innerRef={splashRef} label="Mmm" />

      <Statement innerRef={section2Ref} label="what we're about" />

      <InView>
        <ProjectsRow />
      </InView>
      <SecondaryStatement />
      <InView>
        <ImpactStats />
      </InView>
      <InView>
        <CollabModel />
      </InView>
      <InView>
        <ServicesSection />
      </InView>

      {/* <BlogsRow /> */}
    </main>
  );
}
