"use client";

import PageTitleLarge from "@/components/layout/PageTitleLarge";
import StaticTwoColumn from "@/components/layout/StaticTwoColumn";
import SectionMarker from "@/components/home/SectionMarker";
import useSectionMarker from "@/hooks/useSectionMarker";
import ServicesTab from "@/components/services/ServicesTab";
import SecondaryButton from "@/components/ui/SecondaryButton";
import FAQ from "@/components/layout/FAQ";

export default function Connect() {
  const marker = useSectionMarker();
  const servicesFAQ = [
    {
      question:
        "What’s the difference between Defined and Perpetual Collaboration?",
      answer:
        "Defined Collaboration is perfect for projects with a clear scope, timeline... [rest of content]",
    },
    {
      question: "What is Mesmerise’s unique strength as an agency?",
      answer: "Our strength lies in our holistic, integrated approach...",
    },
  ];
  return (
    <div className="flex flex-col min-h-screen gap-[8rem]">
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
          <p key="desc" className="text-lg">
            We take a holistic approach to unify your brand, website, and
            message. Turning every touchpoint into a reflection of your vision
            that inspires trust, action, and loyalty.
            <br />
            From strategy to execution, design to optimisation, we deliver
            tailored systems that perform today and compound tomorrow.
          </p>,
        ]}
      />
      <ServicesTab />
      <StaticTwoColumn
        label={"what's on offer"}
        column1={[
          <h3 key="title" className="page-title-large">
            Branding & Strategy
          </h3>,
          <p key="desc" className="text-lg">
            Our strategy offering uncovers what truly matters to your audience,
            your business, and your market, and harmonises them into a single,
            easy to implement plan. Brand ID, positioning and analytics
            frameworks serve as the bedrock, every insight is geared towards
            growth and market impact.
          </p>,
          <SecondaryButton
            size="large"
            key="button"
            href="/services/branding-and-strategy"
          >
            Learn more
          </SecondaryButton>,
        ]}
      />
      <StaticTwoColumn
        label={"what's on offer"}
        column1={[
          <h3 key="title" className="page-title-large">
            Website
          </h3>,
          <p key="desc" className="text-lg">
            Your website is paramount if you want to resonate deeply with the
            people that matter most to your business. Every interface, every
            touchpoint, and every interaction is intentional. Designed to build
            trust, connect with your audience, convert and of course Mesmerise.
          </p>,
          <SecondaryButton
            size="large"
            key="button"
            href="/services/branding-and-strategy"
          >
            Learn more
          </SecondaryButton>,
        ]}
      />
      <StaticTwoColumn
        label={"what's on offer"}
        column1={[
          <h3 key="title" className="page-title-large">
            Performance & Growth
          </h3>,
          <p key="desc" className="text-lg">
            You don’t need another agency “running ads”, you need a growth
            architect. We engineer performance-driven marketing strategies and
            omnipresent campaigns that deliver results across every channel your
            audience uses.
          </p>,
          <SecondaryButton
            size="large"
            key="button"
            href="/services/branding-and-strategy"
          >
            Learn more
          </SecondaryButton>,
        ]}
      />
      <StaticTwoColumn
        label={"what's on offer"}
        column1={[
          <h3 key="title" className="page-title-large">
            Business Consulting & Development
          </h3>,
          <p key="desc" className="text-lg">
            We help you future proof your business with cutting edge industry
            insights. This is for brands seeking strategic clarity and
            operational alignment, we serve as your trusted partner in growth.
            Perfect if you’re launching a product, entering a new market, or
            rethinking how teams work together, we guide you to make informed,
            impactful decisions.
          </p>,
          <SecondaryButton
            size="large"
            key="button"
            href="/services/branding-and-strategy"
          >
            Learn more
          </SecondaryButton>,
        ]}
      />
      <FAQ faqItems={servicesFAQ} />
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
