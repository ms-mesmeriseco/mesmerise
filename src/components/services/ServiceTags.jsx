"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ServiceTags({
  items = [],
  label = "Service Capabilities",
  large = true,
}) {
  const router = useRouter();

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.09,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const tagSize = [
    large
      ? "md:rounded-xl  rounded-xl md:px-3 md:py-1 md:text-5xl text-[var(--background)]  bg-[var(--mesm-blue)]  hover:text-[var(--mesm-grey)] hover:bg-[var(--background)] border-1 border-[var(--mesm-grey-dk)] px-3 py-[0.05rem] text-2xl"
      : "rounded-lg px-2 py-0 text-md hover:text-[var(--mesm-grey)] hover:bg-[var(--background)] border-1 border-[var(--mesm-grey-dk)] bg-[var(--mesm-red)] text-[var(--background)] duration-200",
  ];
  const gapSize = [large ? "md:gap-2 gap-1" : "gap-1"];

  const handleClick = (tag, e) => {
    e.stopPropagation(); // Prevent parent link
    router.push(`/work?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <section data-marker={label} className="flex flex-col">
      <h6>What we offer</h6>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={`flex flex-wrap ${gapSize}  border-y border-[var(--mesm-grey-dk)] py-4`}
      >
        {items.map((tag, idx) => (
          <motion.button
            key={idx}
            variants={item}
            onClick={(e) => handleClick(tag, e)}
            className={`${tagSize} font-normal whitespace-nowrap cursor-pointer transition`}
            type="button"
          >
            {tag}
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
