// content/services/website.jsx
import React from "react";

export const heroMedia = "/assets/pro-sculpt.mp4";

export const trustBadgeText = "Trusted by...";
export const trustBadgeLogos = [
  { url: "/logoMark-SVG_mesm.svg", title: "Client 1" },
  { url: "/logoMark-SVG_mesm.svg", title: "Client 2" },
];

// Author rich content as JSX (fast to edit)
export const column1Content = [
  <h1 key="heading">
    Where strategy meets execution and execution delivers profound results.
  </h1>,
  <p key="p" className="p2">
    You don’t need another agency to “run” your ads. You need growth architects
    who engineer & execute desired outcomes.
    <br />
    <br />
    With messaging that resonates, creative that connects, and landing pages
    that feel like telepathy, every touchpoint is handcrafted with intent. Our
    state of the art approach builds trust, wins attention, and consumes market
    share.
  </p>,
];

export const column2Content = [""]; // keep shape consistent with your component

export const serviceTags = [
  "Go-to-Market Strategy",
  "Sales Enablement & Alignment",
  "Systems & Processes",
  "Workflow Optimisation",
  "Customer Journey Maps",
  "Positioning",
  "Proposition Development",
  "Product Research",
  "Systems Optimisation & Implementation",
  "Omni-Channel Marketing",
  "Media Buying",
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
