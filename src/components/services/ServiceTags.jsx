"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ServiceTags({
  items = [],
  label = "Service Capabilities",
}) {
  const router = useRouter();

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const handleClick = (tag, e) => {
    e.stopPropagation(); // Prevent parent link
    router.push(`/work?tag=${encodeURIComponent(tag)}`);
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
          <motion.button
            key={idx}
            variants={item}
            whileHover={{ opacity: 0.6 }}
            onClick={(e) => handleClick(tag, e)}
            className="bg-[var(--mesm-red)] text-[var(--background)] rounded-full px-4 py-1 text-md font-normal whitespace-nowrap cursor-pointer transition"
            type="button"
          >
            {tag}
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
