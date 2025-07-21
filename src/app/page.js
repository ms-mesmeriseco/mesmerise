"use client";

import useSectionMarker from "@/hooks/useSectionMarker";
import HeroBlock from "@/components/home/HeroBlock";
import ProjectScroll from "@/components/blocks/ProjectScroll";
import ServicesList from "@/components/home/ServicesList";
import AboutSection from "@/components/home/AboutSection";
import SectionMarker from "@/components/home/SectionMarker";
import ApproachSection from "@/components/home/ApproachSection";
import CollabModel from "@/components/home/CollabModel";
import BlogScroll from "@/components/blocks/BlogScroll";
import PrimaryButton from "@/components/ui/PrimaryButton";
import StaticTwoColumn from "@/components/layout/StaticTwoColumn";

export default function HomePage() {
  const marker = useSectionMarker();

  return (
    <div className="relative">
      <SectionMarker label={marker} />
      <div className="pr-[var(--global-margin-xs)] flex flex-col gap-[8rem]">
        <HeroBlock />
        <AboutSection />
        <ProjectScroll />
        <ServicesList />
        <StaticTwoColumn
          label={"OUR APPROACH"}
          column1={[
            <h3 key="title" className="text-md md:text-6xl">
              Complexity to clarity.
              <br />
              Vision to Reality.
            </h3>,
            <p key="desc" className="text-lg">
              We immerse ourselves in your goals, uncovering the heart of your
              challenges and ambitions. Then,{" "}
              <strong>
                we craft a tailored, state-of-the-art approach that unites
                strategy, design, and marketing into one cohesive ecosystem.
              </strong>
              <br />
              From insights that spark momentum, to creative that captivates and
              omnipresent campaigns that Mesmerise, we deliver scalable
              solutions that evolve with your vision. At every step, we stand as
              your trusted partner.{" "}
              <strong>
                Building not only growth, but lasting value that inspires the
                people who matter most to your mission.
              </strong>
            </p>,
          ]}
        />
        <CollabModel />
        <BlogScroll />
        <section
          data-marker="say hi"
          className="flex flex-col items-center justify-center gap-[var(--global-margin-lg)] p-[var(--global-margin-lg)] m-auto h-[60vh]"
        >
          <h2 className="text-center text-[6rem] md:text-4xl font-bold">
            Let’s turn your vision into a legacy, and your business into a story
            worth telling.
          </h2>
          <PrimaryButton
            href={"/connect"}
            children={"Let's chat"}
            size="large"
          />
        </section>
      </div>
    </div>
  );
}
