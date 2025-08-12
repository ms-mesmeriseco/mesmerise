"use client";

import { useState } from "react";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function PillBlock({ pills = [], assetMap = {} }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="wrapper flex flex-col gap-[var(--global-margin-sm)] min-h-[50vh]">
      {/* Top row: Pill menu */}
      <div className="flex justify-center">
        <motion.div
          key="motion"
          className="flex flex-row flex-wrap gap-[var(--global-margin-xs)] border border-[var(--mesm-grey-dk)] rounded-md p-1"
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
                className={`whitespace-nowrap px-4 py-1 text-md font-medium rounded-sm transition-colors ${
                  idx === activeIndex
                    ? "bg-[var(--mesm-blue)] text-[var(--background)]"
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
      <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto max-h-[70vh] px-[var(--global-margin-xs)] py-[var(--global-margin-sm)] text-base leading-relaxed">
        <div>
          {renderRichTextWithBreaks(pills[activeIndex]?.content, assetMap)}
        </div>

        {pills[activeIndex]?.media && (
          <div className="relative w-[80%] m-auto overflow-hidden rounded-md aspect-[6/4]">
            {/* 4:6 == 2:3 portrait */}
            <Image
              src={pills[activeIndex].media.url}
              alt={pills[activeIndex].media.url}
              fill
              className="object-cover object-center"
              sizes="(min-width:1024px) 600px, (min-width:768px) 50vw, 100vw"
              priority={activeIndex === 0}
            />
          </div>
        )}
      </div>
    </section>
  );
}
