"use client";

import PageTitleLarge from "@/components/layout/PageTitleLarge";
import StaticTwoColumn from "@/components/layout/StaticTwoColumn";
import SectionMarker from "@/components/home/SectionMarker";
import useSectionMarker from "@/hooks/useSectionMarker";
import ServicesTab from "@/components/services/ServicesTab";

export default function Connect() {
  const marker = useSectionMarker();
  return (
    <div className="flex flex-col min-h-screen gap-[10rem]">
      <SectionMarker label={marker} />
      <PageTitleLarge text="Services" label={marker} />
      <StaticTwoColumn
        label={"what's on offer"}
        column1={[
          <h2 key="title" className="text-md md:text-6xl">
            Premium full service solutions, engineered with insight.
            <br />
            Delivered with intent.
          </h2>,
          <p key="desc" className="max-w-xl text-lg">
            We take a holistic approach to unify your brand, website, and
            message. Turning every touchpoint into a reflection of your vision
            that inspires trust, action, and loyalty.
            <br />
            From strategy to execution, design to optimisation, we deliver
            tailored systems that perform today and compound tomorrow.
          </p>,
        ]}
        columns={["1fr 1fr"]}
      />
      <ServicesTab />
      {/* Bottom Row */}
      <div className="flex h-[40vh]  gap-[var(--global-margin-sm)]">
        <div className="flex-1 border-1 rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)]">
          <button className="w-full h-full text-4xl font-normal text-left p-[var(--global-margin-sm)] flex-start flex">
            Branding & Strategy
          </button>
        </div>
        <div className="flex-1  border-1 rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)]">
          <button className="w-full h-full text-4xl font-normal text-left p-[var(--global-margin-sm)] flex-start flex">
            Website
          </button>
        </div>
        <div className="flex-1  border-1 rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)]">
          <button className="w-full h-full text-4xl font-normal text-left p-[var(--global-margin-sm)] flex-start flex">
            Performance & Growth
          </button>
        </div>
        <div className="flex-1  border-1 rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[var(--foreground)]">
          <button className="w-full h-full text-4xl font-normal text-left p-[var(--global-margin-sm)] flex-start flex">
            Business Consulting & Development
          </button>
        </div>
      </div>
    </div>
  );
}
