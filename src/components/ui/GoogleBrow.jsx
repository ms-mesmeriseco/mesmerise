"use client";

import { motion } from "framer-motion";

export default function GoogleBrow() {
  // 1. Define the animation "rules" for the parent and children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between each child (0.15s)
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="flex flex-row items-center gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 2. Wrap each element in a motion component using the itemVariants */}
      <motion.img
        variants={itemVariants}
        src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"
        alt="Google Brow"
        className="w-8 h-auto object-contain bg-white/95 p-1 rounded-full"
      />

      <motion.span variants={itemVariants} className="text-lg font-bold">
        5.0
      </motion.span>

      <motion.img
        variants={itemVariants}
        src="/icons/five-stars_MESM.png"
        alt="Five Stars"
        className="w-24 h-auto object-contain pb-[6px]"
      />
    </motion.div>
  );
}
