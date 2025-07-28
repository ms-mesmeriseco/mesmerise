"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import ExpandingCard from "@/components/ui/ExpandingCard";
import { getRichTextOptions } from "@/lib/utils/richTextOptions";

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
        {accordionItems.map((item, index) => (
          <ExpandingCard
            key={`accordion-item-${index}`}
            title={item.entryTitle}
            expansionIcon={icon}
            rotation={rotation}
            expandedContent={
              item.textContent && item.textContent.json ? (
                documentToReactComponents(
                  item.textContent.json,
                  getRichTextOptions()
                )
              ) : item.textContent ? (
                <div dangerouslySetInnerHTML={{ __html: item.textContent }} />
              ) : null
            }
            defaultExpanded={activeIndex === index}
            onClick={() => toggleIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
AccordionWidget.propTypes = {
  icon: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    contentType: PropTypes.string,
    fileName: PropTypes.string,
  }),
  accordionItems: PropTypes.arrayOf(
    PropTypes.shape({
      entryTitle: PropTypes.string.isRequired,
      textContent: PropTypes.shape({
        json: PropTypes.object,
      }),
    })
  ),
};
