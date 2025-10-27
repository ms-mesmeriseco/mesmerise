"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";
import StaggeredChildren from "@/hooks/StaggeredChildren";

export default function SingleCaseStudy({
  study,
  summary,
  results,
  timeFrame,
  showText = true,
}) {
  const { caseStudy } = study || {};
  if (!caseStudy) return null;

  const {
    heroMedia,
    projectTitle,
    projectDate,
    projectScope, // optional, kept in case you still need it elsewhere
    dataOne,
    dataTwo,
    dataThree,
    collaborationModel,
  } = caseStudy;

  const formattedYear = projectDate
    ? new Date(projectDate).toLocaleString("en-AU", { year: "numeric" })
    : "";

  const [showSummary, setShowSummary] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Prepare datapoints (skip empty)
  const datapoints = useMemo(
    () => [dataOne?.json, dataTwo?.json, dataThree?.json].filter(Boolean),
    [dataOne?.json, dataTwo?.json, dataThree?.json]
  );

  return (
    <section className="w-full flex flex-col gap-6">
      {/* Image */}
      <div className="relative w-full aspect-[16/9] overflow-hidden ">
        {heroMedia?.url && (
          <Image
            src={heroMedia.url}
            alt={heroMedia.title || "Case Study Image"}
            fill
            className="object-cover duration-300"
            sizes="100vw"
            priority
          />
        )}
      </div>

      {/* Data points grid */}
      {datapoints.length > 0 && (
        <div
          className={[
            "grid w-full gap-2 min-h-[30vh]", // we want borders to meet cleanly
            "grid-cols-1 sm:grid-cols-3",
          ].join(" ")}
        >
          {datapoints.map((json, i) => (
            <div
              key={i}
              className="border border-[var(--mesm-grey-dk)] p-4 sm:p-6 text-sm sm:text-base leading-snug rounded-md"
            >
              <StaggeredChildren baseDelay={0.1}>
                {" "}
                {renderRichTextWithBreaks(json)}
              </StaggeredChildren>
            </div>
          ))}
        </div>
      )}

      {/* Text info */}
      {showText && (
        <div className="flex flex-col gap-3">
          {/* Title + meta */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl md:text-3xl font-bold m-0">
              {projectTitle}
            </h2>

            <span className="bg-[var(--mesm-yellow)] text-[var(--background)] text-sm md:text-base py-1 px-3 rounded-xl whitespace-nowrap">
              {formattedYear}
              {formattedYear && " \u2013 "}
              {collaborationModel ? "Defined" : "Ongoing"}
            </span>
          </div>

          {/* Collapsibles */}
          <div className="flex flex-col text-sm md:text-base">
            {/* Summary */}
            {summary?.json && (
              <div className="border-b-1 border-b border-[var(--mesm-grey-dk)]">
                <button
                  className="w-full text-left px-1 py-4 flex justify-between items-center cursor-pointer"
                  onClick={() => setShowSummary((s) => !s)}
                  aria-expanded={showSummary}
                  aria-controls="summary-panel"
                >
                  <span className="text-lg m-0">Summary</span>
                  <motion.span
                    className="text-lg m-0 inline-block"
                    animate={{ rotate: showSummary ? 45 : 0 }}
                    transition={{ type: "tween", duration: 0.2 }}
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {showSummary && (
                    <motion.div
                      id="summary-panel"
                      key="summary"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden px-1 md:px-2"
                    >
                      <div className="py-6 max-w-[475px]">
                        {renderRichTextWithBreaks(summary.json)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Results */}
            {results?.json && (
              <div className="border-b-1 border-b border-[var(--mesm-grey-dk)]">
                <button
                  className="w-full text-left px-1 py-4 flex justify-between items-center cursor-pointer"
                  onClick={() => setShowResults((s) => !s)}
                  aria-expanded={showResults}
                  aria-controls="results-panel"
                >
                  <span className="text-lg m-0">Results</span>
                  <motion.span
                    className="text-lg m-0 inline-block"
                    animate={{ rotate: showResults ? 45 : 0 }}
                    transition={{ type: "tween", duration: 0.2 }}
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {showResults && (
                    <motion.div
                      id="results-panel"
                      key="results"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden px-1 md:px-2"
                    >
                      <div className="py-6 max-w-[475px]">
                        {renderRichTextWithBreaks(results.json)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
