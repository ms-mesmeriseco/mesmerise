"use client";

import useSectionMarker from "@/hooks/useSectionMarker";
import HeroBlock from "@/components/home/HeroBlock";
import ProjectScroll from "@/components/cms-blocks/ProjectScroll";
import ServicesList from "@/components/home/ServicesList";
import AboutSection from "@/components/home/AboutSection";
import SectionMarker from "@/components/home/SectionMarker";
import ApproachSection from "@/components/home/ApproachSection";
import CollabModel from "@/components/home/CollabModel";
import BlogScroll from "@/components/cms-blocks/BlogScroll";
import PrimaryButton from "@/components/ui/PrimaryButton";

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
        <ApproachSection />
        <CollabModel />
        <BlogScroll />
        <section
          data-marker="say hi"
          className="flex flex-col items-center justify-center gap-[var(--global-margin-lg)] p-[var(--global-margin-lg)] m-auto h-[60vh]"
        >
          <h2 className="text-center text-[6rem] md:text-4xl font-bold">
            Let&apos;s turn your vision into a legacy, and your business into a
            story worth telling.
          </h2>
          <PrimaryButton href={"/connect"} size="large">
            Let&apos;s chat
          </PrimaryButton>
        </section>
      </div>
    </div>
  );
}
