"use client";

import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import InView from "@/hooks/InView";
import Card from "@/components/ui/Card";
import { useState, useMemo } from "react";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";

const SLIDE_W = 425; // px: target ~350 so it works on mobile too
const GAP = 16; // px: matches Tailwind gap-4 (adjust if you change the gap class)

export default function IconRow({ titleText, iconItems = [], displayTwo }) {
  const [startIndex, setStartIndex] = useState(0);

  const showCarousel = displayTwo && iconItems.length > 2;
  const maxStart = useMemo(
    () => (showCarousel ? Math.max(0, iconItems.length - 2) : 0),
    [iconItems.length, showCarousel]
  );

  const handleNext = () => {
    if (startIndex < maxStart) setStartIndex(startIndex + 1);
  };

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  // viewport cap shows exactly two slides on wider screens
  const VIEWPORT_MAX = SLIDE_W * 2 + GAP; // e.g., 716px with 350 + 350 + 16

  return (
    <InView>
      <section
        data-marker="icon row"
        className="wrapper w-full py-8 text-center"
      >
        {renderRichTextWithBreaks(titleText.json)}

        <br />

        {showCarousel ? (
          <div className="relative flex items-center justify-center">
            {/* Left button */}
            <button
              onClick={handlePrev}
              className="absolute left-0 z-10 hover:x-[2px] transition duration-200 cursor-pointer text-black p-3 rounded-full disabled:opacity-40"
              disabled={startIndex === 0}
              aria-label="Previous"
            >
              <img
                className="w-[24px]"
                src="/icons/arrow_back_ios_new_24dp_686767_FILL0_wght200_GRAD0_opsz24.svg"
                alt=""
              />
            </button>

            {/* Viewport: capped so two slides are visible on large screens */}
            <div
              className="relative w-full mx-auto overflow-hidden"
              style={{ maxWidth: `${VIEWPORT_MAX}px` }}
            >
              {/* Track: pixel-based slide & gap; translate by exact slide width */}
              <motion.div
                className="flex flex-nowrap items-start"
                style={{
                  // use inline gap so JS & visuals stay in sync with GAP
                  columnGap: `${GAP}px`,
                }}
                animate={{ x: -(startIndex * (SLIDE_W + GAP)) }}
                transition={{ type: "spring", stiffness: 300, damping: 35 }}
              >
                {iconItems.map((item, idx) => {
                  const { icon, textContent } = item || {};
                  const key = icon?.title
                    ? `${icon.title}-${idx}`
                    : `icon-${idx}`;

                  return (
                    <div
                      key={key}
                      className="shrink-0"
                      style={{ width: `${SLIDE_W}px` }}
                    >
                      <Card icon={icon}>
                        <div className="min-h-[180px] flex flex-col justify-start">
                          {textContent?.json && (
                            <div className="text-sm flex flex-col gap-6">
                              {documentToReactComponents(textContent.json)}
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Right button */}
            <button
              onClick={handleNext}
              className="absolute right-0 z-10 transition duration-200 cursor-pointer text-black pl-2 pr-1 py-1 rounded-full disabled:opacity-40"
              disabled={startIndex >= maxStart}
              aria-label="Next"
            >
              <img
                className="w-[24px]"
                src="/icons/arrow_forward_ios_24dp_686767_FILL0_wght200_GRAD0_opsz24.svg"
                alt=""
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
                  <div className="min-h-[220px] flex flex-col justify-start">
                    {textContent?.json && (
                      <div className="text-sm flex flex-col gap-6">
                        {documentToReactComponents(textContent.json)}
                      </div>
                    )}
                  </div>
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
