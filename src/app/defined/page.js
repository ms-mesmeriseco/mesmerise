"use client";

import PageTitleLarge from "@/components/layout/PageTitleLarge";
import CollabToggle from "@/components/ui/CollabToggle";
import StaticTwoColumn from "@/components/layout/StaticTwoColumn";
import StaggeredWords from "@/hooks/StaggeredWords";
import InView from "@/hooks/InView";
import StaggeredChildren from "@/hooks/StaggeredChildren";
import HorizontalScrollCarousel from "@/components/layout/HorizontalScrollCarousel";
import SteppedAccordion from "@/components/layout/SteppedAccordion";
import useSectionMarker from "@/hooks/useSectionMarker";

function Statement({ innerRef }) {
  return (
    <section
      ref={innerRef}
      data-marker="WHAT WE DO"
      className="flex items-center justify-center px-6 text-white"
    >
      <div className="text-center">
        <InView>
          <StaggeredWords
            as="h2"
            text="We craft brand, web, and content experiences that look sexy, and convert."
            className="page-title-medium"
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
      data-marker="WHO WE ARE"
      className="min-h-[70vh] flex items-center justify-center px-6 text-white"
    >
      <div className="max-w-[1200px] text-center text-balance">
        <StaggeredWords
          as="p"
          text="There’s only one way to find out if we have what it takes (pssst it involves getting in touch...)"
          className="page-title-medium"
        />
      </div>
    </section>
  );
}

export default function DefinedCollab() {
  const bubble =
    "border border-[var(--mesm-grey-dk)] text-[var(--foreground)] hover:text-[var(--background)] bg-[var(--background)] rounded-xl py-2 px-3 hover:bg-[var(--mesm-yellow)] duration-300";

  return (
    <div className="p-[var(--global-margin-lg)]">
      <PageTitleLarge text="Defined" />
      <div className="flex flex-col gap-8">
        {/* Intro paragraph with inline stagger */}
        <StaticTwoColumn
          column1={[
            <StaggeredWords
              key="p"
              as="p"
              text="Our Defined collaboration model is perfect for rebrands, strategic launches, omnipresent campaigns, and projects that demand flawless execution. We cut through complexity, focus on your goals, and give you the confidence of a partner who delivers with precision and care."
              className="p3 min-h-[50vh]"
            />,
          ]}
        />

        {/* WHO IT'S FOR */}
        <StaticTwoColumn
          label="WHO IT'S FOR"
          column1={[<h3 key="h3">Who it's for</h3>]}
          column2={[
            <StaggeredChildren
              key="intro"
              as="div"
              baseDelay={0.5} // previously `delay={2}`
              perItem={0.2}
              duration={0.35}
              y="0.15em"
              blur={4}
              className="flex flex-col gap-4"
            >
              <div className={bubble}>
                <p className="p2">
                  Business owners, start-ups and enterprise-level organisations
                  that have a defined scope and need results delivered on time,
                  on budget
                </p>
              </div>

              <div className={bubble}>
                <p className="p2">
                  You’re just starting and need to carve out your branding,
                  strategy and website
                </p>
              </div>

              <div className={bubble}>
                <p className="p2">
                  Launching a new product or service and need marketing assets,
                  landing pages and infrastructure to make an impact
                </p>
              </div>

              <div className={bubble}>
                <p className="p2">
                  You want to test the market before you commit to a long-term
                  investment
                </p>
              </div>

              <div className={bubble}>
                <p className="p2">
                  You need data unified and interpreted to make informed
                  decisions
                </p>
              </div>

              <div className={bubble}>
                <p className="p2">
                  Time-bound seasonal campaigns that need precise execution
                </p>
              </div>

              <div className={bubble}>
                <p className="p2">
                  You’re launching and need a team of specialists to support
                  your goals
                </p>
              </div>
            </StaggeredChildren>,
          ]}
        />
        <Statement />
        <h3 className="text-center">How it might look</h3>
        <HorizontalScrollCarousel
          images={[
            {
              src: "/assets/imac.png",
              alt: "Project A",
              href: "",
              caption: "Style Guide for YUTORI JAPANESE GARDENS",
            },
            {
              src: "/assets/imac.png",
              alt: "Project B",
              href: "",
              caption: "LOGO CONCEPT FOR TPPT",
            },
            {
              src: "/assets/imac.png",
              alt: "Project C",
              href: "",
              caption: "Colour Palette refinement for ProSculpt",
            },
          ]}
          overlayText={
            <>
              <strong>Selected Work</strong>
              <br />
              2022–2025
            </>
          }
          link="/work" // fallback link used if an image item lacks href
          height={460}
          rounded="rounded-xl"
        />
        <br />
        <br />
        <br />
        <h3 className="text-center">Next steps</h3>
        <SteppedAccordion
          steps={[
            {
              title: "1. Project Scope",
              content: (
                <p>
                  Together, we uncover your objectives, challenges, and what
                  success looks like. From there, we shape a precise scope and a
                  roadmap built around your goals.
                </p>
              ),
            },
            {
              title: "2. Research & Strategy",
              content: (
                <p>
                  We dive deep into research. Your market, audience,
                  competitors, and current assets. This intelligence becomes the
                  bedrock for a data-driven strategy that balances immediate
                  wins with long-term growth.
                </p>
              ),
            },
            {
              title: "3. Design, Build, Create",
              content: (
                <p>
                  This is where your vision becomes tangible. Whether it’s a new
                  website, a campaign rollout, or a refined brand identity, we
                  craft and develop with precision. Every detail is designed to
                  elevate your business and move you closer to the outcomes that
                  matter.
                </p>
              ),
            },
            {
              title: "4. Launch + Handover",
              content: (
                <p>
                  Your project goes live seamlessly and on schedule. We ensure
                  you’re equipped with the knowledge, documentation and systems
                  to harness your new assets.
                </p>
              ),
            },
            {
              title: "5. Analytics",
              content: (
                <p>
                  We analyse performance against goals, extract insights, and
                  make refinements. From defined optimisation to continuous
                  collaboration.
                </p>
              ),
            },
          ]}
          singleOpen={false}
          defaultOpen={[0]}
          indent="clamp(8px, 2.6vw, 56px)"
        />

        <SecondaryStatement />

        <CollabToggle />
      </div>
    </div>
  );
}
