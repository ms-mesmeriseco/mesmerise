"use client";

import { useState } from "react";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { motion, AnimatePresence } from "framer-motion";
import InView from "@/hooks/InView";

export default function PillBlock({ pills = [], blockTitle }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // No pills? Don't render the block.
  if (!pills.length) return null;

  const activePill = pills[activeIndex] || pills[0];

  // Fix possible duplicate _key values from migration
  const rawContent = activePill?.content || [];
  const contentBlocks = rawContent.map((block, idx) => ({
    ...block,
    _key: block._key ? `${block._key}-${idx}` : `pill-block-${idx}`,
  }));

  return (
    <InView>
      <section className="flex flex-col gap-[var(--global-margin-lg)] justify-center">
        {blockTitle && (
          <h2 className="text-2xl font-semibold text-center mb-4">
            {blockTitle}
          </h2>
        )}

        {/* Top row: Pill menu */}
        <div className="flex justify-center w-full">
          <motion.div
            key="motion"
            className="flex flex-row justify-between flex-wrap gap-[var(--global-margin-xs)] border border-[var(--mesm-grey-dk)] rounded-2xl p-1 w-6/8"
          >
            <AnimatePresence mode="wait">
              {pills.map((pill, idx) => (
                <motion.button
                  key={`pill-${idx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex-1 whitespace-nowrap px-4 py-1 text-md font-medium rounded-xl transition-colors ${
                    idx === activeIndex
                      ? "bg-[var(--mesm-red)] text-[var(--background)]"
                      : " hover:text-[var(--foreground)] text-[var(--mesm-grey)] cursor-pointer"
                  }`}
                >
                  {pill.label}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Content row */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 md:px-[var(--global-margin-xs)] py-[var(--global-margin-sm)] md:gap-18 gap-10 text-base leading-relaxed min-h-[50vh]">
          <AnimatePresence mode="wait" initial={false}>
            {/* TEXT */}
            <motion.div
              key={`text-${activeIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {contentBlocks.length > 0 && (
                <PortableText
                  value={contentBlocks}
                  components={{
                    block: {
                      h3: ({ children }) => (
                        <h3 className="text-xl font-semibold mb-2">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-lg font-medium mb-1">{children}</h4>
                      ),
                      normal: ({ children }) => (
                        <p className="mb-3">{children}</p>
                      ),
                    },
                  }}
                />
              )}
            </motion.div>

            {/* IMAGE */}
            {activePill?.media?.url && (
              <motion.div
                key={`img-${activeIndex}`}
                className="relative w-full h-auto md:min-h-[50vh] min-h-[20vh] overflow-hidden"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <Image
                  src={activePill.media.url}
                  alt={activePill.label || "Pill image"}
                  fill
                  className="object-contain object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={activeIndex === 0}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </InView>
  );
}
