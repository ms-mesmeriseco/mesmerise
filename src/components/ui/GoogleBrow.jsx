"use client";

import { motion } from "framer-motion";

export default function GoogleBrow() {
  return (
    <motion.div
      className="flex flex-row items-center gap-3"
      // 1. Set the starting state: invisible and shifted 20px to the left
      initial={{ opacity: 0, x: -20 }}
      // 2. Set the end state: fully visible and at its natural position
      animate={{ opacity: 1, x: 0 }}
      // 3. Optional: Fine-tune the timing
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <img
        src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"
        alt="Google Brow"
        className="w-5 h-auto object-contain"
      />
      <span className="text-lg font-bold">5.0</span>
      <img
        src="/icons/five-stars_MESM.png"
        alt="Five Stars"
        className="w-24 h-auto object-contain pb-1"
      />
    </motion.div>
  );
}
