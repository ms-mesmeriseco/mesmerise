'use client';

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export default function AccordionWidget({ icon, accordionItems = [] }) {
    // console.log("RENDER ACCORDION");
  const [activeIndex, setActiveIndex] = useState(null);

  // useEffect(() => {
    // console.log("AccordionWidget mounted");
    // console.log("Icon data:", icon);
    // console.log("Accordion items:", accordionItems);
  // }, [icon, accordionItems]);

  const toggleIndex = (index) => {
    // console.log("Toggling accordion index:", index);
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="space-y-2">
        {accordionItems.map((item, index) => {
          const isActive = activeIndex === index;
          // console.log(`Rendering item ${index}:`, item.entryTitle, "Active:", isActive);

          return (
            <div key={`accordion-item-${index}`} className=" border-1 rounded-md">
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex items-center p-[var(--global-margin)] justify-between font-normal hover:bg-[var(--foreground)] hover:text-[var(--background)] duration-300 cursor-pointer focus:outline-none"
                aria-expanded={isActive}
              >
                <span className="text-left">{item.entryTitle}</span>
                {icon?.url && (
                  <Image
                    src={icon.url}
                    alt={icon.title || "Accordion Icon"}
                    width={24}
                    height={24}
                    className="object-contain ml-4"
                  />
                )}
              </button>
              {isActive && (
                <div className="px-4 py-3">
                  {documentToReactComponents(item.textContent?.json)}
                </div>
              )}
            </div>
          );
        })}
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
