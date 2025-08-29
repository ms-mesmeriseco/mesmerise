"use client";

import PageTitleLarge from "@/components/layout/PageTitleLarge";
import SecondaryButton from "@/components/ui/SecondaryButton";
import CollabToggle from "@/components/ui/CollabToggle";
import StaticTwoColumn from "@/components/layout/StaticTwoColumn";
import StaggeredWords from "@/hooks/StaggeredWords";
import InView from "@/hooks/InView";
import StaggeredChildren from "@/hooks/StaggeredChildren";
import HorizontalScrollCarousel from "@/components/layout/HorizontalScrollCarousel";
import SteppedAccordion from "@/components/layout/SteppedAccordion";
import useSectionMarker from "@/hooks/useSectionMarker";

function Statement({ marker, text, className }) {
  return (
    <section
      data-marker={marker}
      className="flex items-center justify-center px-6 text-white min-h-screen"
    >
      <div className="text-center">
        <InView>
          <StaggeredWords
            as="h2"
            text={text}
            className={className ?? "page-title-large"}
          />
        </InView>
      </div>
    </section>
  );
}

function SecondaryStatement({ marker, text, cta }) {
  useSectionMarker();
  return (
    <section
      data-marker={marker}
      className="min-h-screen flex items-center justify-center px-6 text-white"
    >
      <div className="max-w-[1200px] text-center text-balance">
        <StaggeredWords as="p" text={text} className="page-title-large" />
        {cta ? (
          <>
            <br />
            <br />
            <br />
            <SecondaryButton size="x-large">{cta}</SecondaryButton>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default function CollabTemplate({ content, currentSlug }) {
  const bubble =
    "border border-[var(--mesm-grey-dk)] text-[var(--foreground)] hover:text-[var(--background)] bg-[var(--background)] rounded-xl py-2 px-3 hover:bg-[var(--mesm-yellow)] duration-150";

  return (
    <div className="p-[var(--global-margin-lg)]">
      <PageTitleLarge text={content.pageTitle} />

      <div className="flex flex-col gap-8">
        {/* Intro */}
        <StaticTwoColumn
          column1={[
            <p key="p" className="p3 min-h-[50vh]">
              {content.intro}
            </p>,
          ]}
        />

        {/* Who it's for */}
        <StaticTwoColumn
          column1={[<h3 key="h3">{content.whoItsForTitle}</h3>]}
          column2={[
            <StaggeredChildren
              key="intro"
              as="div"
              baseDelay={0.1}
              perItem={0.09}
              duration={0.15}
              y="0.15em"
              blur={4}
              className="flex flex-col gap-4"
            >
              {content.whoItsForItems.map((item, i) => (
                <div className={bubble} key={i}>
                  <p className="p2">{item}</p>
                </div>
              ))}
            </StaggeredChildren>,
          ]}
        />

        {/* Big statement */}
        <Statement
          marker={content.markers.what}
          text={content.statement.text}
          className={content.statement.className}
        />

        {/* Carousel */}
        <HorizontalScrollCarousel
          title={content.carousel.title}
          center={content.carousel.center}
          images={content.carousel.images}
          overlayText={
            <>
              <strong>{content.carousel.overlayHeading}</strong>
              <br />
              {content.carousel.overlayRange}
            </>
          }
          link={content.carousel.link}
          height={content.carousel.height}
          rounded={content.carousel.rounded}
        />

        <br />
        <br />
        <br />

        {/* Steps */}
        <SteppedAccordion
          title={content.stepsTitle}
          center
          steps={content.steps.map(({ title, body }) => ({
            title,
            content: <p>{body}</p>,
          }))}
          singleOpen={false}
          defaultOpen={[0]}
          indent="clamp(8px, 2.6vw, 56px)"
          width="20vw"
        />

        {/* Secondary */}
        <SecondaryStatement
          marker={content.markers.who}
          text={content.secondary.text}
          cta={content.secondary.cta}
        />

        {/* Toggle that navigates between routes */}
        <CollabToggle current={currentSlug} />
      </div>
    </div>
  );
}
