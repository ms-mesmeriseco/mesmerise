"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HorizontalAccordion({ steps = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="w-full overflow-x-hidden h-[50vh]">
      <div className="flex flex-row border-t border-[var(--foreground)] ">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={index}
              layout
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className={`flex flex-row items-baseline-last border-[var(--foreground)] pt-[200px]  h-[40vh] ${
                isActive ? "w-[40vw]" : "w-[10vw]"
              }`}
            >
              {/* Step Title (Rotated) */}
              <div
                onClick={() => toggle(index)}
                className={`h-[50px] w-[100px] px-2 whitespace-nowrap transform -rotate-90 origin-bottom mt-[0px] transition-opacity text-left ${
                  isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
                }`}
              >
                <div className="h-[50px] border-b-1 text-left">
                  {step.title}
                </div>
              </div>

              {/* Step Content */}

              {isActive && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.5, ease: "easeInOut" }}
                  className="p-[var(--global-margin-sm)]"
                >
                  <p className="text-base leading-relaxed text-left">
                    {step.content}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
