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
export const para1Content =
  "Whether you’re a startup launching your first site or an enterprise ready to revitalise your digital presence, we build websites that align with your audience, strengthen your brand, and deliver results that matter.";

export const para2Content =
  "Our research-driven, systemic approach ensures your website resonates with your people, represents your business with integrity, and supports meaningful growth long after launch.";

export const para3Content =
  "Unsure about what you need? Explore our basis of collaboration, to work out if an ongoing approach is better suited to your business. ";

export const serviceTags = [
  "Ad creative",
  "Marketing Materials",
  "Paid Media Management",
  "Search Engine Optimisation",
  "Content Marketing",
  "Local SEO & Geo Targeting",
  "Customer Lifecycle",
  "Omni-Channel Marketing",
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

export const PACKAGES = {
  SMB: [
    {
      title: "Get Online Fast",
      price: "Start from",
      features: [
        "Fast, lean, and strategic, perfect for Minimum Viable Products, new ideas, or getting your first site live quickly while leaving room to grow.",
      ],
      outcome:
        "A polished, professional site built to meet immediate needs and budgets.",
    },
    {
      title: "Level Up & Polish",
      price: "$2,500",
      features: [
        "Refine and enhance your current site’s design, usability, and messaging to keep it effective and engaging — without starting from scratch.",
      ],
      outcome:
        "A refreshed digital presence that feels new and performs better.",
    },
    {
      title: "Fresh Start",
      price: "$5,000",
      features: [
        "A ground-up rebuild that defines your online identity, optimises conversions, and provides a scalable foundation for growth.",
      ],
      outcome:
        "A website that grows with your business and earns trust from day one.",
    },
  ],
  Enterprise: [
    {
      title: "Website Surge",
      price: "Custom",
      features: [
        "A rapid-response site solution for product launches, campaigns, or departmental initiatives — delivered with speed, precision, and enterprise-level quality.",
      ],
      outcome:
        "A focused, professional site for immediate impact without compromise.",
    },

    {
      title: "Website Refresh",
      price: "$20,000",
      features: [
        "Modernise and optimise your existing site with improved user experience, accessibility, and performance while maintaining alignment with your corporate identity and governance.",
      ],
      outcome:
        "A more efficient, impactful site that stays ahead of expectations.",
    },
    {
      title: "Website Transformation",
      price: "$10,000",
      features: [
        "A full-scale overhaul of your site, built to align with corporate strategy, support multi-department needs, and ensure security, scalability, and compliance.",
      ],
      outcome:
        "A future-proofed digital platform that strengthens trust, supports growth, and empowers internal teams to deliver more.",
    },
  ],
};
