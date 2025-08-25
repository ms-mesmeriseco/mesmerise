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
  <h1 key="heading">Make the right moves with insight and instinct</h1>,
  <p key="p" className="p2">
    For brands seeking strategic clarity and operational alignment, we serve as
    your trusted partner in growth.
  </p>,
  <p key="p2">
    We bring cutting-edge industry insights and proven expertise to help you
    plan smarter, move faster, and execute with precision. Whether you’re
    launching a product, entering a new market, or rethinking how your teams and
    systems work together, we guide you to make informed, impactful decisions,
    and turn ambition into action.
  </p>,
];

export const column2Content = [""]; // keep shape consistent with your component

export const serviceTags = [
  "Competitor Analysis",
  "Interviews & Workshops",
  "Customer Research",
  "Analytics Setup & Audit",
  "Brand Strategy & Positioning",
  "Developing Tone of Voice",
  "Content Strategy",
  "Personas & Archetypes",
  "Customer Lifecycle",
  "Paid Media Management",
  "Search Engine Optimisation",
  "Content Marketing",
  "Local SEO & Geo Targeting",
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
