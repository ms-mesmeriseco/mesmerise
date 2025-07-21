"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { dangerouslySetInnerHTML } from "react";

export default function FAQ({
  faqItems,
  label,
  title = "Frequently Asked Questions",
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      data-marker={label}
      className="wrapper grid grid-cols-[1fr_4fr_1fr] gap-y-[var(--global-margin-sm)]"
    >
      <div className="col-span-12 text-center pb-[var(--global-margin-md)]">
        <h2 className="text-[6rem] font-normal">{title}</h2>
      </div>

      {faqItems.map((item, idx) => {
        const isOpen = activeIndex === idx;

        return (
          <div
            key={idx}
            className="col-start-2 col-span-1 border-b border-[var(--foreground)]"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex justify-between items-center h-[72px] text-left transition duration-200 hover:opacity-60 cursor-pointer"
            >
              <span className="text-xl font-normal">{item.question}</span>
              <span className="text-4xl font-light ease-in-out duration-500">
                {isOpen ? "×" : "+"}
              </span>
            </button>

            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-[var(--global-margin-xs)] pb-[var(--global-margin-sm)] text-base leading-relaxed text-[var(--foreground)]"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              ></motion.div>
            )}
          </div>
        );
      })}
    </section>
  );
}
