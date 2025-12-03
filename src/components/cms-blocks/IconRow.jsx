"use client";

import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import InView from "@/hooks/InView";
import Card from "@/components/ui/Card";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  isValidElement,
} from "react";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";

function renderTitle(titleText) {
  if (!titleText) return null;

  // Manual string title
  if (typeof titleText === "string") {
    return <h2 className="mb-4">{titleText}</h2>;
  }

  // Manual JSX/React node
  if (isValidElement(titleText)) {
    return titleText;
  }

  // Contentful rich text: { json: ... }
  if (titleText?.json) {
    return renderRichTextWithBreaks(titleText.json);
  }

  return null;
}

function renderItemContent(textContent) {
  if (!textContent) return null;

  // Manual string
  if (typeof textContent === "string") {
    return <p>{textContent}</p>;
  }

  // Manual JSX/React node
  if (isValidElement(textContent)) {
    return textContent;
  }

  // Contentful rich text: { json: ... }
  if (textContent?.json) {
    return documentToReactComponents(textContent.json);
  }

  return null;
}

export default function IconRow({ titleText, iconItems = [], displayTwo }) {
  const showCarousel = displayTwo && iconItems.length > 2;

  const scrollerRef = useRef(null);
  const cardsRef = useRef([]);
  const [centerIndex, setCenterIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, iconItems.length);
  }, [iconItems.length]);

  const updateCenter = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || cardsRef.current.length === 0) return;

    const rect = scroller.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    let bestIdx = 0;
    let bestDist = Infinity;
    cardsRef.current.forEach((el, idx) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const d = Math.abs(cardCenter - centerX);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = idx;
      }
    });

    setCenterIndex(bestIdx);

    const maxLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const left = scroller.scrollLeft;
    setAtStart(left <= 2);
    setAtEnd(left >= maxLeft - 2);
  }, []);

  useEffect(() => {
    if (!showCarousel) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => updateCenter();
    const onResize = () => updateCenter();

    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    updateCenter();

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [showCarousel, updateCenter]);

  const snapTo = useCallback((index) => {
    const scroller = scrollerRef.current;
    const target = cardsRef.current[index];
    if (!scroller || !target) return;

    const scrollLeft =
      target.offsetLeft + target.offsetWidth / 2 - scroller.clientWidth / 2;

    scroller.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, []);

  const goPrev = () => {
    if (centerIndex > 0) snapTo(centerIndex - 1);
  };
  const goNext = () => {
    if (centerIndex < iconItems.length - 1) snapTo(centerIndex + 1);
  };

  const cardVariants = {
    idle: { scale: 1, opacity: 0.88 },
    focus: {
      scale: 1.02,
      opacity: 1,
      transition: { type: "spring", stiffness: 220, damping: 24 },
    },
  };

  return (
    <InView>
      <section
        data-marker="icon row"
        className="w-full py-8 text-center relative"
      >
        {renderTitle(titleText)}
        <br />

        {showCarousel ? (
          <div className="relative flex flex-col items-center">
            <div
              ref={scrollerRef}
              className="relative w-full mx-auto overflow-x-auto overflow-y-visible snap-x snap-mandatory scroll-smooth
                         [scrollbar-width:none] [-ms-overflow-style:none]"
              style={{ scrollbarWidth: "none" }}
              aria-label="Icon cards"
            >
              <ul className="flex gap-2 py-3 select-none">
                {iconItems.map((item, idx) => {
                  const { icon, textContent } = item || {};
                  const key = icon?.title
                    ? `${icon.title}-${idx}`
                    : `icon-${idx}`;
                  const isFocused = centerIndex === idx;

                  return (
                    <li
                      key={key}
                      ref={(el) => (cardsRef.current[idx] = el)}
                      className="relative snap-center shrink-0 no-list px-1"
                      tabIndex={0}
                      aria-selected={isFocused}
                    >
                      <motion.div
                        variants={cardVariants}
                        animate={isFocused ? "focus" : "idle"}
                        className="relative w-[72vw] sm:w-[58vw] md:w-[44vw] lg:w-[28vw]"
                      >
                        <div className="relative overflow-hidden rounded-lg border border-[var(--mesm-grey-dk)] bg-black/20">
                          <Card icon={icon}>
                            <div className="p-0 md:m-0 rounded-sm">
                              <div className="min-h-[180px] flex flex-col justify-start text-left">
                                <div className="text-sm flex flex-col gap-6">
                                  {renderItemContent(textContent)}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Two-dot navigation */}
            <div className="mt-6 w-full flex justify-end">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Scroll left"
                  onClick={goPrev}
                  disabled={atStart}
                  className={`h-5 w-5 rounded-full border border-[var(--accent2)] ${
                    atStart
                      ? "opacity-40 cursor-default bg-transparent"
                      : "bg-[var(--accent2)] hover:bg-transparent duration-200 cursor-pointer"
                  }`}
                />
                <button
                  type="button"
                  aria-label="Scroll right"
                  onClick={goNext}
                  disabled={atEnd}
                  className={`h-5 w-5 rounded-full border border-[var(--accent2)] ${
                    atEnd
                      ? "opacity-40 cursor-default bg-transparent"
                      : "bg-[var(--accent2)] hover:bg-transparent duration-200 cursor-pointer"
                  }`}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:auto-cols-auto lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-[var(--global-margin-xs)]">
            {iconItems.map((item, idx) => {
              const { icon, textContent } = item || {};
              const key = icon?.title ? `${icon.title}-${idx}` : `icon-${idx}`;
              return (
                <Card key={key} icon={icon}>
                  <div className="min-h-[220px] flex flex-col justify-start text-left">
                    <div className="text-sm flex flex-col gap-6">
                      {renderItemContent(textContent)}
                    </div>
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
  titleText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.shape({
      json: PropTypes.object,
    }),
  ]),
  iconItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.shape({
        url: PropTypes.string,
        title: PropTypes.string,
      }),
      textContent: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
        PropTypes.shape({
          json: PropTypes.object,
        }),
      ]),
    })
  ),
  displayTwo: PropTypes.bool,
};
