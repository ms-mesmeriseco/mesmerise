"use client";

import { useState, useMemo, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FAQTwoColumn
 * Props:
 * - label?: string (data-marker)
 * - title?: string
 * - items: Array<{ question: string, textContent: string }>
 * - singleOpen?: boolean (only one panel open at a time)
 * - defaultOpen?: number[] (indexes to open by default)
 */
export default function FAQTwoColumn({
  label,
  title = "Frequently Asked Questions",
  items = [],
  singleOpen = false,
  defaultOpen = [0],
}) {
  // Build a Set for O(1) toggling
  const [openSet, setOpenSet] = useState(new Set(defaultOpen));
  const baseId = useId();

  const toggle = (idx) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (singleOpen) {
        if (next.has(idx)) {
          next.clear();
        } else {
          next.clear();
          next.add(idx);
        }
      } else {
        next.has(idx) ? next.delete(idx) : next.add(idx);
      }
      return next;
    });
  };

  const rows = useMemo(() => items ?? [], [items]);

  return (
    <section
      data-marker={label}
      className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-x-[var(--global-margin-lg)] gap-y-[var(--global-margin-md)]"
    >
      {/* Left column: title */}
      <div className="md:pr-[var(--global-margin-sm)]">
        <h6 className="">{title}</h6>
        {/* <h2 className="text-[clamp(2rem,6vw,6rem)] font-normal leading-none">
          {title}
        </h2> */}
      </div>

      {/* Right column: custom accordion */}
      <div className="w-full divide-y divide-[var(--mesm-grey-dk)] border-t border-b border-[var(--mesm-grey-dk)]">
        {rows.map(({ question, textContent }, idx) => {
          const panelId = `${baseId}-panel-${idx}`;
          const headingId = `${baseId}-heading-${idx}`;
          const isOpen = openSet.has(idx);

          return (
            <div key={idx} className="relative">
              {/* Toggle button (question row) */}
              <button
                id={headingId}
                aria-controls={panelId}
                aria-expanded={isOpen}
                onClick={() => toggle(idx)}
                className="w-full text-left flex items-start justify-between gap-4 py-4 md:py-5 px-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--mesm-yellow)]  opacity-100 hover:opacity-65 transition-opacity  cursor-pointer"
              >
                <span className=" md:text-xl leading-tight">{question}</span>

                {/* Plus/Minus icon */}
                <span
                  className="shrink-0 grid place-items-center  h-7 w-7"
                  aria-hidden="true"
                >
                  <motion.span
                    initial={false}
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="inline-block"
                  >
                    +
                  </motion.span>
                </span>
              </button>

              {/* Collapsible answer */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-5 md:pb-6 pl-1 pr-10">
                      {/* Your answers include <br />, so render as HTML */}
                      <div
                        className="leading-relaxed py-4 max-w-[475px]"
                        dangerouslySetInnerHTML={{ __html: textContent }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
