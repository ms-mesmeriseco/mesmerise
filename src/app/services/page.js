"use client";

import FAQ from "@/components/layout/FAQ";
import StaggeredWords from "@/hooks/StaggeredWords";
import ServicesRail from "@/components/services/ServicesRail";

export default function Services() {
  const servicesFAQ = [
    {
      question:
        "What's the difference between Defined and Continuous Collaboration?",
      textContent:
        "Defined Collaboration is perfect for projects with a clear scope, timeline, and deliverables. Ideal for businesses looking for a fixed-price, time-bound engagement.<br/><br/>Continuous Collaboration is designed for long-term partnerships with flexibility and scalability, providing ongoing strategic, creative, and performance support to keep you at the forefront of your industry.",
    },
    {
      question: "What is Mesmerise's unique strength as an agency?",
      textContent:
        "Our strength lies in our holistic, integrated approach across Strategy, Design, Omnipresent Marketing, and Business Consulting.<br/><br/>We don't just “run ads”, we carefully construct ecosystems that elevate your market position. This allows you to charge more, lower your cost per acquisition and extend the lifetime value of your clients. ",
    },
    {
      question: "What type of clients do you typically work with?",
      textContent:
        "We collaborate with ambitious SMEs, premium B2B brands, SaaS & technology companies, and enterprise-level organisations.<br/><br/>Our approach enables us to navigate both the agility of startups and the complexity of large corporate environments.",
    },
    {
      question: "What does the typical project process look like?",
      textContent:
        "It starts with a chat. The first step is a discovery session to understand your goals, challenges, and priorities. Then we recommend the right engagement model, create a roadmap, and execute with clear milestones.",
    },
    {
      question: "How flexible are your engagement models?",
      textContent:
        "Flexibility is one of our core strengths. Whether you need a tightly scoped, fixed-budget project or an evolving, long-term partnership, we can adapt to meet your business needs at every stage.",
    },
    {
      question: "What kind of project management setup do you offer?",
      textContent:
        "We're a small tight knit team which means you deal directly with the people responsible for the execution.<br/><br/>That means fewer delays, no miscommunication, and lighting fast momentum.<br/><br/><ul><li>Petar & Nicole shape the strategy with you and make sure every decision drives revenue forward.</li><li>Matilda takes the lead on design and development, turning ideas into assets that perform.</li><li>Simba handles the business development and consulting, aligning projects with your long-term goals.</li></ul><br/><br/>We set clear milestones, give you regular updates, and adapt touchpoints around your preferences. The level of communication is tailored to your project and level of need.<br/><br/>This way you get the best of both worlds: the responsiveness and personal attention of a intimate team, with the professionalism and accountability of a boutique agency.",
    },
    {
      question: "What results can I expect from working with Mesmerise?",
      textContent:
        "It depends on your industry and niche. Organise a strategy session and we'll tell you exactly what you can expect.<br/><br/>For instance, REIGNER had to open another business to meet fulfillment, Tony Caulk hired 4+ new staff and a full time admin person, the list goes on.<br/><br/>90% of businesses we work with can't handle the lead volume we are able to generate.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen gap-[8rem]">
      <div className="pt-24">
        <StaggeredWords
          key="h1"
          text="Premium full service solutions, engineered with insight. Delivered
            with intent."
          className="page-title-large text-2xl md:text-4xl leading-tight"
          center
        />
      </div>

      <ServicesRail />

      <FAQ
        label="common questions"
        title="Frequently asked questions"
        items={servicesFAQ}
        singleOpen={false}
        defaultOpen={[0]}
      />
    </div>
  );
}
