"use client";

import AccordionWidget from "@/components/cms-blocks/Accordion";

export default function FAQ({
  faqItems,
  label,
  title = "Frequently Asked Questions",
  accordionItems = [],
}) {
  return (
    <section
      data-marker={label}
      className="grid md:grid-cols-[1fr_4fr_1fr] grid-cols-1 gap-y-[var(--global-margin-sm)]"
    >
      <div className="col-span-12 text-center pb-[var(--global-margin-md)]">
        <h2 className="text-[6rem] font-normal">{title}</h2>
      </div>
      <div className="col-start-2 col-span-1">
        <AccordionWidget
          icon={{ url: "/icons/plus.svg", title: "Expand" }}
          accordionItems={accordionItems.map((item) => ({
            entryTitle: item.question,
            textContent: item.textContent,
          }))}
          rotation={45}
        />
      </div>
    </section>
  );
}
