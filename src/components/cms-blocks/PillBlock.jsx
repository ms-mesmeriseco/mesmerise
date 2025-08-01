"use client";

import { useState } from "react";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";

export default function PillBlock({ pills = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="wrapper flex flex-col gap-[var(--global-margin-sm)]">
      {/* Top row: Pill menu */}
    <div className="flex justify-center">
  <div className="flex flex-row flex-wrap gap-[var(--global-margin-xs)] border border-[var(--foreground)] rounded-full p-[var(--global-margin-xs)]">
    {pills.map((pill, idx) => (
      <button
        key={idx}
        onClick={() => setActiveIndex(idx)}
        className={`whitespace-nowrap px-4 py-2 text-md font-medium rounded-full transition-colors ${
          idx === activeIndex
            ? "bg-[var(--mesm-red)] text-[var(--background)]"
            : "bg-[var(--muted-bg)] text-[var(--foreground)] hover:opacity-80"
        }`}
      >
        {pill.label}
      </button>
    ))}
  </div>
</div>


      {/* Bottom row: Active pill content */}
      <div className="overflow-y-auto max-h-[70vh] px-[var(--global-margin-xs)] py-[var(--global-margin-sm)] text-base leading-relaxed">
       {renderRichTextWithBreaks(pills[activeIndex]?.content)} 
      </div>
    </section>
  );
}
