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
      className="flex items-center justify-center px-6 text-white min-h-screen"
    >
      <div className="text-center">
        <InView>
          <StaggeredWords
            as="h2"
            text="As ongoing partners, we focus on growth beyond numbers—instilling confidence and loyalty to produce brands people trust."
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
          text="For businesses who think exponentially."
          className="page-title-large"
        />
      </div>
    </section>
  );
}

export default function ContinuousCollab() {
  const bubble =
    "border border-[var(--mesm-grey-dk)] text-[var(--foreground)] hover:text-[var(--background)] bg-[var(--background)] rounded-xl py-2 px-3 hover:bg-[var(--mesm-yellow)] duration-300";

  return (
    <div className="p-[var(--global-margin-lg)]">
      <PageTitleLarge text="Continuous" />
      <div className="flex flex-col gap-8">
        {/* Intro paragraph with inline stagger */}
        <StaticTwoColumn
          column1={[
            <StaggeredWords
              key="p"
              as="p"
              text="Our Continuous collaboration model is built for businesses that value consistency, compounding results, and proactive strategy. From ongoing refinement to new initiatives, we become an extension of your team. Ensuring your online presence adapts as you scale, your brand strengthens over time, and every decision is executed by analytical insight and attention to detail. "
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
                  For ambitious startups, pioneering entrepreneurs and
                  enterprise-level organisations looking for a long-term growth
                  partner
                </p>
              </div>

              <div className={bubble}>
                <p className="p2">
                  Innovative business owners who want to stay ahead of the curve
                  and be at the forefront of their industry
                </p>
              </div>

              <div className={bubble}>
                <p className="p2">
                  Enterprise organisations wanting to simplify their digital
                  operations
                </p>
              </div>

              <div className={bubble}>
                <p className="p2">
                  Founders who want to spend less time worrying about leads and
                  more time enjoying their weekends
                </p>
              </div>

              <div className={bubble}>
                <p className="p2">
                  Companies needing fresh content & dynamic digital
                  infrastructure that delivers impressive results and keeps
                  stakeholders gratified
                </p>
              </div>

              <div className={bubble}>
                <p className="p2">
                  CMO’s looking for a multi-disciplinary team that helps them
                  execute and guide junior staff
                </p>
              </div>

              <div className={bubble}>
                <p className="p2">Brands looking to cement loyalty and trust</p>
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
          width="50vw"
          steps={[
            {
              title: "1. Onboarding",
              content: (
                <p>
                  We start by understanding your objectives, establishing
                  effective communication channels and integrating into your
                  digital ecosystem.
                </p>
              ),
            },
            {
              title: "2. Plan & Prioritise",
              content: (
                <p>
                  Together we define what matters most. Tasks are prioritised,
                  balancing timelines with evolving needs.
                </p>
              ),
            },
            {
              title: "3. Implementation",
              content: (
                <p>
                  We put our plans into action. Everything is executed with
                  intent and attention to detail.
                </p>
              ),
            },
            {
              title: "4. Open Dialogue",
              content: (
                <p>
                  Progress is transparent and continuous. We share insights,
                  invite feedback, and keep communication flowing so you’re
                  always in the loop.
                </p>
              ),
            },
            {
              title: "5. Evolution & Impact",
              content: (
                <p>
                  We measure, refine, and adapt. Insights drive continuous
                  improvement, helping to cement your business at the highest
                  echelon of your industry.
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
