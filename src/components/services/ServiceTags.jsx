"use client";

import { motion } from "framer-motion";

export default function ServiceTags({
  items = [],
  label = "Service Capabilities",
}) {
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section
      data-marker={label}
      className="flex flex-col gap-[var(--global-margin-sm)]"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-[var(--global-margin-xs)]"
      >
        {items.map((tag, idx) => (
          <motion.div
            key={idx}
            variants={item}
            whileHover={{ opacity: 0.6 }}
            className="bg-[var(--mesm-red)] text-[var(--background)] rounded-full px-4 py-1 text-md font-normal whitespace-nowrap "
          >
            {tag}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
