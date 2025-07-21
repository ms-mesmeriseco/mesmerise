import { useState } from "react";

export default function FAQ({
  faqItems,
  title = "Frequently Asked Questions",
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="wrapper grid grid-cols-[1fr_4fr_1fr] gap-y-[var(--global-margin-sm)]">
      <div className="col-span-12 text-center pb-[var(--global-margin-md)]">
        <h2 className="text-[6rem] font-normal">{title}</h2>
      </div>

      {faqItems.map((item, idx) => (
        <div
          key={idx}
          className="col-start-2 col-span-1 border-b border-[var(--foreground)] py-[var(--global-margin-xs)] cursor-pointer"
        >
          <button
            onClick={() => toggle(idx)}
            className="w-full text-left text-3xl font-medium transition-colors duration-200 hover:opacity-80"
          >
            {item.question}
          </button>
          {activeIndex === idx && (
            <div className="pt-[var(--global-margin-xs)] text-base leading-relaxed text-[var(--foreground)]">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
