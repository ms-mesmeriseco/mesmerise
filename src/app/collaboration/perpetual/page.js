"use client";

import PageTitleLarge from "@/components/layout/PageTitleLarge";
import CollabToggle from "@/components/ui/CollabToggle";
import CollaborationDetail from "@/components/blocks/CollaborationDetail";

export default function PerpetualCollab() {
  return (
    <>
      <PageTitleLarge text="Perpetual" />
      <CollaborationDetail
        title="Defined Collaboration"
        audiencePoints={[
          {
            title:
              "Startups, SMEs, and enterprises needing targeted, project-based solutions",
            desc: "When you have a clear goal and a defined scope, we help you execute with precision.",
          },
          {
            title: "Specialised expertise for a single, high-impact initiative",
            desc: "For businesses who need senior-level guidance and delivery on a specific challenge.",
          },
          {
            title:
              "Specific outcomes like rebrands, product launches, or rapid deployments",
            desc: "When timing matters and execution must align perfectly with milestones.",
          },
          {
            title:
              "Fixed budgets and clear deadlines requiring predictability and accountability",
            desc: "We scope projects tightly so you get exactly what you need — on time and on budget.",
          },
          {
            title:
              "Pilot projects to test new ideas or validate strategies at a smaller scale",
            desc: "Perfect for experimenting with campaigns, messaging, or channels before scaling up.",
          },
          {
            title:
              "Seasonal or campaign-based initiatives with short-term goals",
            desc: "From seasonal promotions to event-driven activations, we deliver with impact and efficiency.",
          },
        ]}
        steps={[
          {
            step: "① Alignment & Project Scope",
            text: "We start by listening. Together we define your objectives, challenges, and what success looks like. Then we create a custom roadmap and agree on specifics.",
          },
          {
            step: "② Insight & Strategy",
            text: "We dive into deep research - analysing your market, audience, competitors, and existing assets. This informs a holistic, data-driven strategy aligned with your long-term goals.",
          },
          {
            step: "③ Creative & Build",
            text: "We bring your strategy to life through integrated creative, development, and campaign build-out. Every detail is designed to support your growth objectives and reflect your brand integrity.",
          },
          {
            step: "④ Launch & Activate",
            text: "Your campaigns, platforms, and assets go live, effortlessly and on schedule. We document everything, train your team where needed, and ensure you’re ready to leverage the new ecosystem fully.",
          },
          {
            step: "⑤ Review & Optimise",
            text: "We don’t disappear after launch. We measure results, analyse performance against goals, and recommend next steps, from optimisation to ongoing support through our Continuous Engagement model.",
          },
        ]}
        cta={{
          headline: "Have questions? Ready to discuss your goals?",
          subtext: "Our team is here to help you plan your next move.",
          label: "Let’s Collaborate →",
          href: "/connect",
        }}
        metrics={[
          {
            title: "$15,000+",
            desc: "Typical budgets for Defined Collaboration projects, ensuring you receive the strategic expertise and quality delivery your objectives deserve.",
          },
          {
            title: "2–6 months",
            desc: "Most Defined Collaboration projects run 2 to 6 months, scoped tightly to your goals, timeline, and deliverables.",
          },
          {
            title: "3–5 experts",
            desc: "A bespoke team of 3–5 specialists assembled to execute your project with precision.",
          },
          {
            title: "20+ delivered",
            desc: "We’ve successfully delivered over 20 Defined Collaboration projects since 2022 — spanning strategy, design, development, and performance.",
          },
        ]}
      />
      <CollabToggle />
    </>
  );
}
