"use client";

import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
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
              className="absolute left-0 z-10 hover:x-[2px] transition duration-200 cursor-pointer text-black p-3 rounded-full"
              disabled={startIndex === 0}
            >
              <motion.img
                whileHover={{
                  translateX: "-2px",
                }}
                transition={{ duration: 0.2 }}
                className="w-[24px]"
                src="/icons/arrow_back_ios_new_24dp_686767_FILL0_wght200_GRAD0_opsz24.svg"
              />
            </button>
            <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
              <div className="flex items-center justify-between">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={startIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="grid grid-cols-2 gap-[var(--global-margin-xs)] w-8/10 max-w-5xl mx-auto"
                  >
                    {visibleItems.map((item, idx) => {
                      const { icon, textContent } = item || {};
                      const key = icon?.title
                        ? `${icon.title}-${idx}`
                        : `icon-${idx}`;

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
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="absolute right-0 z-10 transition duration-200 cursor-pointer text-black pl-2 pr-1 py-1 rounded-full"
              disabled={startIndex + 2 >= iconItems.length}
            >
              <motion.img
                whileHover={{
                  translateX: "2px",
                }}
                transition={{ duration: 0.2 }}
                className="w-[24px]"
                src="/icons/arrow_forward_ios_24dp_686767_FILL0_wght200_GRAD0_opsz24.svg"
              />
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
