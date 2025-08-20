"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// FULL TAG TAXONOMY
const categories = {
  growth: [
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
    "Customer Lifecycle",
    "Paid Media Management",
    "Search Engine Optimisation",
    "Content Marketing",
    "Local SEO & Geo Targeting",
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
    "SEO Optimisation",
    "Analytics & Reporting",
    "Security",
    "Hosting & Deployment",
  ],
};

const tabs = ["growth", "strategy", "design", "development"];

export default function ServicesTabs() {
  const [active, setActive] = useState("growth");
  const router = useRouter();

  const containerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.03 } },
    exit: {},
  };

  const itemVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const handleTagClick = (tag) => {
    router.push(`/work?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="wrapper flex flex-col gap-[var(--global-margin-md)]">
      {/* Tabs */}
      <div className="flex gap-[var(--global-margin-sm)] justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`md:text-md text-sm font-light uppercase transition duration-200 px-4 py-1 rounded-md cursor-pointer ${
              active === tab
                ? "text-[var(--foreground)] opacity-100 hover:opacity-80"
                : "opacity-50 hover:opacity-80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tag Chips */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex flex-wrap md:gap-[var(--global-margin-xs)] gap-1 justify-center"
        >
          {categories[active].map((tag, idx) => (
            <motion.button
              key={idx}
              variants={itemVariants}
              whileHover={{ opacity: 0.7 }}
              onClick={() => handleTagClick(tag)}
              className="bg-[var(--mesm-blue)] text-[var(--background)] rounded-xl md:rounded-2xl md:px-4 md:py-2 px-2 py-1 md:text-5xl text-2xl font-normal whitespace-nowrap cursor-pointer transition"
              type="button"
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
