"use client";

import { useState } from "react";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";
import { motion, AnimatePresence } from "framer-motion";

export default function PillBlock({ pills = [], assetMap = {} }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="wrapper flex flex-col gap-[var(--global-margin-sm)]">
      {/* Top row: Pill menu */}
      <div className="flex justify-center">
        <motion.div
          key="motion"
          className="flex flex-row flex-wrap gap-[var(--global-margin-xs)] border border-[var(--mesm-grey-dk)] rounded-full p-2"
        >
          <AnimatePresence mode="wait">
            {pills.map((pill, idx) => (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`whitespace-nowrap px-4 py-1 text-md font-medium rounded-full transition-colors ${
                  idx === activeIndex
                    ? "bg-[var(--mesm-grey)] text-[var(--background)]"
                    : " text-[var(--mesm-grey)] hover:opacity-80"
                }`}
              >
                {pill.label}
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom row: Active pill content */}
      <div className="overflow-y-auto max-h-[70vh] px-[var(--global-margin-xs)] py-[var(--global-margin-sm)] text-base leading-relaxed">
        {renderRichTextWithBreaks(pills[activeIndex]?.content, assetMap)}
      </div>
    </section>
  );
}
