"use client";

import useSectionMarker from "@/hooks/useSectionMarker";
import HeroBlock from "@/components/home/HeroBlock";
import ProjectScroll from "@/components/blocks/ProjectScroll";
import ServicesList from "@/components/home/ServicesList";
import AboutSection from "@/components/home/AboutSection";
import SectionMarker from "@/components/home/SectionMarker";

export default function HomePage() {
  const marker = useSectionMarker(); // same as before

  return (
    <div className="relative">
      <SectionMarker label={marker} />
      <div className="pr-[var(--global-margin)]">
   <HeroBlock />
      <AboutSection />
      <ProjectScroll />
      <ServicesList />

      </div>
   
    </div>
  );
}
