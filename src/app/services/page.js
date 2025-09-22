"use client";

import StaticTwoColumn from "@/components/layout/StaticTwoColumn";
import StaticSingleColumn from "@/components/layout/StaticSingleColumn";
import Button from "@/components/ui/Button";
import FAQ from "@/components/layout/FAQ";
import StaggeredWords from "@/hooks/StaggeredWords";
import ServicesRail from "@/components/services/ServicesRail";
import SteppedAccordion from "@/components/layout/SteppedAccordion";

export default function Connect() {
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
    <div className="flex flex-col min-h-screen gap-[8rem] p-[var(--global-margin-md)]">
      <div className="pt-24">
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

      <ServicesRail />
      {/* <br />
      <br />
      <br />
      <br />
      <br />
      <br /> */}
      <FAQ
        label="common questions"
        title="Frequently Asked Questions"
        items={servicesFAQ} // your array of { question, textContent }
        singleOpen={false} // set true to allow only one open at a time
        defaultOpen={[0]} // which indexes start open
      />

      {/* Bottom Row */}
    </div>
  );
}
