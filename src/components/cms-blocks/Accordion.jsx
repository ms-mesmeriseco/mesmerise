"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export default function AccordionWidget({ icon, accordionItems = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="space-y-2">
        {accordionItems.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={`accordion-item-${index}`}
              className="col-start-2 col-span-1 border-b border-[var(--foreground)]"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex justify-between items-center h-auto py-[0.5rem] text-left transition duration-200 hover:opacity-60 cursor-pointer"
                aria-expanded={isActive}
              >
                <span className="text-left">{item.entryTitle}</span>
                {icon?.url && (
                  <Image
                    src={icon.url}
                    alt={icon.title || "Accordion Icon"}
                    width={24}
                    height={24}
                    className={`object-contain ml-4 transition-transform duration-300 ${
                      isActive ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              <div
                className={`px-4 py-3 transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-0 h-0 overflow-hidden p-0"
                }`}
                style={{
                  pointerEvents: isActive ? "auto" : "none",
                  transitionProperty: "opacity, height, padding",
                }}
              >
                {isActive && documentToReactComponents(item.textContent?.json)}
              </div>
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
