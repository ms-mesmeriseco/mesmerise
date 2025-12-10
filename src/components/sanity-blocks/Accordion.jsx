"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import ExpandingCard from "@/components/ui/ExpandingCard";
import BlockRenderer from "@/lib/utils/BlockRenderer";

export default function AccordionWidget({
  icon,
  accordionItems = [],
  rotation = 180,
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        {accordionItems.map((item, index) => {
          const { entryTitle, textContent } = item || {};

          const expandedContent =
            Array.isArray(textContent) && textContent.length ? (
              // 👇 Pass the PT array straight into BlockRenderer
              <BlockRenderer block={textContent} />
            ) : null;

          return (
            <ExpandingCard
              key={item._id || `accordion-item-${index}`}
              title={entryTitle}
              expansionIcon={icon} // should be a URL string (see GROQ note below)
              rotation={rotation}
              expandedContent={expandedContent}
              defaultExpanded={activeIndex === index}
              onClick={() => toggleIndex(index)}
            />
          );
        })}
      </div>
    </section>
  );
}

AccordionWidget.propTypes = {
  icon: PropTypes.string, // URL string from Sanity
  accordionItems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      entryTitle: PropTypes.string,
      textContent: PropTypes.array, // Portable Text blocks
    })
  ),
  rotation: PropTypes.number,
};
