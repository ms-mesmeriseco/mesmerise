"use client";

import StaticTwoColumn from "@/components/layout/StaticTwoColumn";
import StaticSingleColumn from "@/components/layout/StaticSingleColumn";
import SectionMarker from "@/components/home/SectionMarker";
import useSectionMarker from "@/hooks/useSectionMarker";
import SecondaryButton from "@/components/ui/SecondaryButton";
import FAQ from "@/components/layout/FAQ";
import StaggeredWords from "@/hooks/StaggeredWords";

export default function Connect() {
  const marker = useSectionMarker();
  const servicesFAQ = [
    {
      question:
        "What’s the difference between Defined and Perpetual Collaboration?",
      textContent:
        "Defined Collaboration is perfect for projects with a clear scope, timeline, and deliverables. Ideal for businesses looking for a fixed-price, time-bound engagement.<br /><br />Perpetual Collaboration is designed for long-term partnerships with flexibility and scalability, providing ongoing strategic, creative, and performance support as your needs evolve.",
    },
    {
      question: "What is Mesmerise’s unique strength as an agency?",
      textContent:
        "Our strength lies in our holistic, integrated approach across Strategy, Design, Growth Marketing, and Business Consulting.<br /><br />We don’t just execute, we carefully construct systems that align every touchpoint of your digital presence with your business goals, delivering growth that compounds.",
    },
    {
      question: "What type of clients do you typically work with?",
      textContent:
        "We collaborate with ambitious SMEs, premium B2B brands, SaaS & technology companies, and enterprise-level organisations.<br /><br />Our experience enables us to navigate both the agility of startups and the complexity of large corporate environments.",
    },
    {
      question: "What does the typical project process look like?",
      textContent:
        "We start with a discovery session to understand your goals, challenges, and priorities. Then we recommend the right engagement model, assemble the right team, create a roadmap, and execute with clear milestones.",
    },
    {
      question: "How flexible are your engagement models?",
      textContent:
        "Flexibility is one of our core strengths. Whether you need a tightly scoped, fixed-budget project or an evolving, long-term partnership, we can adapt to meet your business needs at every stage.",
    },
    {
      question: "What kind of project management setup do you offer?",
      textContent:
        "You’ll have a dedicated project lead as your single point of contact, supported by real-time dashboards for transparency on progress, resource allocation, and KPIs.<br /><br />Defined Collaborations are fixed and predictable, while Perpetual Collaborations are billed monthly, with room to adjust as needed.",
    },
    {
      question: "What results can I expect from working with Mesmerise?",
      textContent:
        "We bring measurable impact to every engagement. For instance REIGNER had to open another business to meet fulfillment, Tony Caulk hired 4+ new staff and a full time admin person, the list goes on. 97% of small businesses we work with can’t handle the lead volume and don’t have systems in place to handle the growth engine we’ve implemented.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen gap-[8rem] p-[var(--global-margin-lg)]">
      <SectionMarker label={marker} />
      <div className="text-center py-24">
        <StaticSingleColumn
          label={"HUMAN SERVICES"}
          column={[
            <StaggeredWords
              key="h1"
              text="Premium full service solutions, engineered with insight. Delivered
            with intent."
              className="page-title-large text-2xl md:text-4xl leading-tight"
              center
            />,
          ]}
        />
      </div>
      {/* <section data-marker="CLICK ME" className="md:min-h-[80vh] min-h-[50vh]">
        <ServicesTab />
      </section> */}
      <StaticTwoColumn
        label={"STRATEGY"}
        column1={[
          <StaggeredWords
            key="h2"
            as="h2"
            text="Strategy"
            className="page-title-large text-2xl md:text-4xl leading-tight"
          />,
          ,
          <p key="desc" className="p2">
            Our strategy offering uncovers what truly matters to your audience,
            your business, and your market, and harmonises them into a single,
            easy to implement plan. Brand ID, positioning and analytics
            frameworks serve as the bedrock, every insight is geared towards
            growth and market impact.
          </p>,
          <SecondaryButton size="large" key="button" href="/services/strategy">
            Learn more
          </SecondaryButton>,
        ]}
      />
      <StaticTwoColumn
        label={"BRANDING"}
        column2={[
          <StaggeredWords
            key="h2"
            as="h2"
            text="Branding"
            className="page-title-large text-2xl md:text-4xl leading-tight"
          />,
          ,
          <p key="desc" className="p2">
            Our strategy offering uncovers what truly matters to your audience,
            your business, and your market, and harmonises them into a single,
            easy to implement plan. Brand ID, positioning and analytics
            frameworks serve as the bedrock, every insight is geared towards
            growth and market impact.
          </p>,
          <SecondaryButton size="large" key="button" href="/services/branding">
            Learn more
          </SecondaryButton>,
        ]}
      />
      <StaticTwoColumn
        label={"WEBSITE"}
        column1={[
          <div key="web" className="flex flex-col gap-6">
            <StaggeredWords
              key="h2"
              as="h2"
              text="Website"
              className="page-title-large text-2xl md:text-4xl leading-tight"
            />

            <p key="desc" className="p2">
              Your website is paramount if you want to resonate deeply with the
              people that matter most to your business. Every interface, every
              touchpoint, and every interaction is intentional. Designed to
              build trust, connect with your audience, convert and of course
              Mesmerise.
            </p>

            <SecondaryButton size="large" key="button" href="/services/website">
              Learn more
            </SecondaryButton>
          </div>,
        ]}
      />
      <StaticTwoColumn
        label={"PERFORMANCE"}
        column2={[
          <StaggeredWords
            key="h2"
            as="h2"
            text="Performance & Growth"
            className="page-title-large text-2xl md:text-4xl leading-tight"
          />,
          <p key="desc" className="p2">
            You don&apos;t need another agency “running ads”, you need a growth
            architect. We engineer performance-driven marketing strategies and
            omnipresent campaigns that deliver results across every channel your
            audience uses.
          </p>,
          <SecondaryButton
            size="large"
            key="button"
            href="/services/performance-growth"
          >
            Learn more
          </SecondaryButton>,
        ]}
      />
      <StaticTwoColumn
        label={"CONSULTING"}
        column1={[
          <StaggeredWords
            key="h2"
            as="h2"
            text="Analytics"
            className="page-title-large text-2xl md:text-4xl leading-tight"
          />,
          <p key="desc" className="p2">
            We help you future proof your business with cutting edge industry
            insights. This is for brands seeking strategic clarity and
            operational alignment, we serve as your trusted partner in growth.
            Perfect if you&apos;re launching a product, entering a new market,
            or rethinking how teams work together, we guide you to make
            informed, impactful decisions.
          </p>,
          <SecondaryButton size="large" key="button" href="/services/analytics">
            Learn more
          </SecondaryButton>,
        ]}
      />
      <FAQ
        label="common questions"
        title="Frequently Asked Questions"
        accordionItems={servicesFAQ.map((item) => ({
          question: item.question,
          textContent: item.textContent,
        }))}
      />
      {/* Bottom Row */}
    </div>
  );
}
