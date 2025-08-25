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
  <p className="p2" key="para">
    Whether you’re a bold startup finding your voice or an established business
    ready to redefine your presence, we’re here to guide you through every stage
    of your brand’s evolution.
    <br />
    <br />
    We’ll equip you with the clarity, strategy, and creative direction to
    connect with your audience, elevate your positioning, and inspire growth
    that's enduring.
  </p>,
];

export const column2Content = [
  <h2 key="heading" className="text-center page-title-large">
    We craft distinctive, flexible visual identities that capture the essence of
    who you are and where you’re headed.
  </h2>,
];

export const serviceTags = [
  "Branding",
  "Creative Direction",
  "Marketing Materials",
  "User Experience",
  "UI Design",
  "Interaction Design",
  "Sound Design",
  "Product Design",
  "Prototyping",
  "Web Design",
  "Motion Graphics",
];

export const processSteps = [
  {
    title: "1. Discovery",
    content:
      "We immerse ourselves in your business, your audience and the market, uncovering insights that shape your brand’s positioning and unlock strategic clarity.",
  },
  {
    title: "2. Ideation",
    content:
      "Through lo-fi sketches, moodboards, and analysis of discovery data, we explore creative directions and present initial concepts to ensure alignment with your goals and vision from the very beginning.",
  },
  {
    title: "3. Design",
    content:
      "We craft a cohesive, considered proposal that resonates with your audience and meets your business needs, bringing your brand to life with purpose and precision.",
  },
  {
    title: "4. Delivery",
    content:
      "We deliver a complete, polished toolkit of visual, verbal and creative assets, empowering your team to present your brand consistently, with confidence and impact.",
  },
  {
    title: "5. Activation",
    content:
      "We help you integrate your refreshed brand seamlessly across your website, products and campaigns, driving customer engagement and creating measurable impact.",
  },
];
