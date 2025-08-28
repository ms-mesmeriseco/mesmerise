"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SteppedAccordion({
  steps = [],
  singleOpen = false,
  defaultOpen = [],
  indent = "clamp(8px, 2.6vw, 56px)",
  className = "",
  width = "60vw",
}) {
  const [open, setOpen] = useState(() => new Set(defaultOpen));

  const toggle = (idx) => {
    setOpen((prev) => {
      const next = new Set(singleOpen ? [] : prev);
      if (prev.has(idx)) next.delete(idx);
      else next.add(idx);
      if (singleOpen) next.add(idx);
      return next;
    });
  };

  const hasSteps = steps && steps.length > 0;
  const maxIdx = hasSteps ? steps.length - 1 : 0;

  // Motion variants
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 + i * 0.06,
        duration: 0.35,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    }),
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ "--step-indent": "10vw" }}
    >
      <ul className="space-y-3">
        {steps.map((step, i) => {
          const isOpen = open.has(i);
          return (
            <motion.li
              key={i}
              className="no-list py-1"
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-10% 0px" }}
              variants={itemVariants}
              style={{ marginLeft: `calc(var(--step-indent) * ${i})` }}
            >
              <div
                className="rounded-2xl border border-[var(--mesm-grey-dk)] text-[var(--background)] bg-[var(--background)]/80 backdrop-blur-sm shadow-sm overflow-hidden bg-[var(--mesm-red)] hover:opacity-80 duration-200"
                style={{ maxWidth: width }}
              >
                {/* Header */}
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-4 py-3 md:px-5 md:py-4 flex items-center justify-between gap-4 transition-colors cursor-pointer"
                >
                  <h3 className="font-medium leading-tight">{step.title}</h3>
                  <motion.span
                    initial={false}
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "tween", duration: 0.2 }}
                    className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full border border-current"
                    aria-hidden
                  >
                    {/* plus icon (rotates to x when open) */}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 1v10M1 6h10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.span>
                </button>

                {/* Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.28,
                        ease: [0.2, 0.65, 0.3, 0.9],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 md:px-5 md:pb-5 text-lg">
                        {step.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
