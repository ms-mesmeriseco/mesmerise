"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = {
  growth: [
    "Go-to-Market Strategy",
    "Sales Enablement & Alignment",
    "Systems & Processes",
    "Workflow Optimisation",
    "Customer Journey Maps",
    "Positioning",
    "Proposition Refinement",
    "Product Research and Refinement",
    "Systems Optimisation & Implementation",
  ],
  strategy: [
    "Competitor Analysis",
    "Interviews & Workshops",
    "Customer Research",
    "Analytics Setup & Audit",
    "Brand Strategy & Positioning",
    "Developing Tone of Voice",
    "Content Strategy",
    "Personas & Archetypes",
  ],
  design: [
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
  ],
  development: [
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
  ],
};

const tabs = ["growth", "strategy", "design", "development"];

export default function ServicesTabs() {
  const [active, setActive] = useState("growth");

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.03,
      },
    },
    exit: {},
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <section className="wrapper flex flex-col gap-[var(--global-margin-md)]">
      {/* Tabs */}
      <div className="flex gap-[var(--global-margin-sm)] justify-around">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`text-md font-medium capitalize transition duration-200 px-4 py-1 rounded-md cursor-pointer ${
              active === tab
                ? "text-[var(--foreground)] opacity-50 hover:opacity-80"
                : "opacity-50 hover:opacity-80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex flex-wrap gap-[var(--global-margin-xs)] justify-center"
        >
          {categories[active].map((capability, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-[#c1d2fc] text-[var(--background)] rounded-2xl px-4 py-2 text-5xl font-normal whitespace-nowrap"
            >
              {capability}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
