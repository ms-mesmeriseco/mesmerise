"use client";

import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import InView from "@/hooks/InView";
import Card from "@/components/ui/Card";
import { useState } from "react";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";

export default function IconRow({ titleText, iconItems = [], displayTwo }) {
  const [startIndex, setStartIndex] = useState(0);
  const showCarousel = displayTwo && iconItems.length > 2;

  const handleNext = () => {
    if (startIndex + 2 < iconItems.length) setStartIndex(startIndex + 1);
  };

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const visibleItems = showCarousel
    ? iconItems.slice(startIndex, startIndex + 2)
    : iconItems;

  return (
    <InView>
      <section className="wrapper w-full py-8 text-center">
        {renderRichTextWithBreaks(titleText.json)}
       
        <br />

        {showCarousel ? (
          <div className="relative flex items-center justify-center">
            <button
              onClick={handlePrev}
              className="absolute left-0 z-10 bg-[var(--mesm-grey-dk)] hover:bg-[var(--mesm-grey)] transition duration-200 cursor-pointer text-black pr-2 pl-1 py-1 rounded-full"
              disabled={startIndex === 0}
            >
              <img className="rotate-90 w-10" src="/icons/arrow-down.svg"/>
            </button>

            <div className="grid grid-cols-2 gap-[var(--global-margin-xs)] w-8/10 max-w-5xl mx-auto">
              {visibleItems.map((item, idx) => {
                const { icon, textContent } = item || {};
                const key = icon?.title ? `${icon.title}-${idx}` : `icon-${idx}`;

                return (
                  <Card key={key} icon={icon}>
                    {textContent?.json && (
                      <div className="text-sm flex flex-col gap-6">
                        {documentToReactComponents(textContent.json)}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              className="absolute right-0 z-10 bg-[var(--mesm-grey-dk)] hover:bg-[var(--mesm-grey)] transition duration-200 cursor-pointer text-black pl-2 pr-1 py-1 rounded-full"
              disabled={startIndex + 2 >= iconItems.length}
            >
              <img className="rotate-270 w-10" src="/icons/arrow-down.svg"/>
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-[var(--global-margin-xs)]">
            {iconItems.map((item, idx) => {
              const { icon, textContent } = item || {};
              const key = icon?.title ? `${icon.title}-${idx}` : `icon-${idx}`;

              return (
                <Card key={key} icon={icon}>
                  {textContent?.json && (
                    <div className="text-sm flex flex-col gap-6">
                      {documentToReactComponents(textContent.json)}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </InView>
  );
}

IconRow.propTypes = {
  blockTitle: PropTypes.string,
  iconItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.shape({
        url: PropTypes.string,
        title: PropTypes.string,
      }),
      textContent: PropTypes.shape({
        json: PropTypes.object,
      }),
    })
  ),
  displayTwo: PropTypes.bool,
};
