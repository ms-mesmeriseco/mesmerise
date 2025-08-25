// content/services/website.jsx
import React from "react";

export const heroMedia = "/assets/pro-sculpt.mp4";
import SecondaryButton from "@/components/ui/SecondaryButton.jsx";

export const trustBadgeText = "Trusted by...";
export const trustBadgeLogos = [
  { url: "/logoMark-SVG_mesm.svg", title: "Client 1" },
  { url: "/logoMark-SVG_mesm.svg", title: "Client 2" },
];

// Author rich content as JSX (fast to edit)
export const column1Content = [
  <p key="para" className="p2">
    Whether you’re a startup launching your first site or an enterprise ready to
    revitalise your digital presence, we build websites that align with your
    audience, strengthen your brand, and deliver results that matter.
    <br />
    <br />
    Our research-driven, systemic approach ensures your website resonates with
    your people, represents your business with integrity, and supports
    meaningful growth long after launch.
  </p>,
];

export const column2Content = [
  <div key="h2" className="items-center flex flex-col gap-6">
    <h2 className="text-center page-title-large">
      What We Build Isn&apos;t Just a Website, It&apos;s a Growth Engine.
    </h2>
    <br />
    <SecondaryButton size="x-large" href="/connect">
      Learn more
    </SecondaryButton>
  </div>,
]; // keep shape consistent with your component

export const serviceTags = [
  "Front-end Development",
  "Back-end Development",
  "CMS Integration",
  "Systems Architecture",
  "E-Commerce",
  "Website Builders",
  "Applications",
  "Accessibility",
  "Performance Testing",
  "Ongoing Support",
];

export const processSteps = [
  {
    title: "1. Discovery",
    content:
      "We analyse your business goals, audience, and market to lay the strategic foundation for a site that performs and connects.",
  },
  {
    title: "2. Ideation",
    content:
      "Through architecture, wireframes, and style exploration, we develop concepts that align user needs with your vision.",
  },
  {
    title: "3. Design",
    content:
      "We craft comprehensive, systematic designs that embody your brand, enhance usability, and meet your objectives.",
  },
  {
    title: "4. Development",
    content:
      "We bring your website to life with a tailored build that meets your technical needs and future-proofs your presence. Whether it be fully custom, or utilising a powerful web builder.",
  },
  {
    title: "5. Quality Assurance",
    content:
      "This is an important stage. Here, we can iron out any creases in design or build, ensuring your complete satisfaction with the finished product.",
  },
  {
    title: "6. Handover",
    content:
      "Your fully functional website is handed over with all documentation and team training needed to manage it effectively.",
  },
];
