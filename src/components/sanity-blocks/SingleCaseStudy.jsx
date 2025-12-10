"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PortableText } from "@portabletext/react";
import StaggeredChildren from "@/hooks/StaggeredChildren";

// PortableText config for body (summary/results)
const portableComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-2 leading-snug last:mb-0">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-1">{children}</ol>
    ),
  },
};

// Slightly different styling for datapoint tiles (big stat + copy)
const datapointComponents = {
  block: {
    h2: ({ children }) => (
      <h3 className="text-3xl font-semibold mb-2 leading-tight">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-sm leading-snug mb-1 last:mb-0">{children}</p>
    ),
  },
};

export default function SingleCaseStudy({ study, showText = true }) {
  // `study` is the singleCaseStudy block from pageBlocks
  if (!study) return null;

  const { caseStudy, summary = [], results = [], timeFrame } = study;
  if (!caseStudy) return null;

  const {
    heroMedia, // string URL from GROQ
    projectTitle,
    projectDate,
    collaborationModel,
    dataOne,
    dataTwo,
    dataThree,
  } = caseStudy;

  const heroSrc =
    typeof heroMedia === "string" ? heroMedia : heroMedia?.url || null;

  const formattedYear = projectDate
    ? new Date(projectDate).toLocaleString("en-AU", { year: "numeric" })
    : "";

  const [showSummary, setShowSummary] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const hasSummary = Array.isArray(summary) && summary.length > 0;
  const hasResults = Array.isArray(results) && results.length > 0;

  // Gather non-empty datapoints
  const datapoints = useMemo(
    () =>
      [
        { id: "one", value: dataOne },
        { id: "two", value: dataTwo },
        { id: "three", value: dataThree },
      ].filter((dp) => Array.isArray(dp.value) && dp.value.length > 0),
    [dataOne, dataTwo, dataThree]
  );

  return (
    <section className="w-full col-span-full flex flex-col gap-6">
      {/* Image */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        {heroSrc && (
          <Image
            src={heroSrc}
            alt={projectTitle || "Case Study Image"}
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
            "grid w-full gap-2 min-h-[30vh]",
            "grid-cols-1 sm:grid-cols-3",
          ].join(" ")}
        >
          {datapoints.map((dp, index) => (
            <div
              key={dp.id}
              className="border border-[var(--mesm-grey-dk)] p-4 sm:p-6 text-sm sm:text-base leading-snug rounded-md"
            >
              <StaggeredChildren baseDelay={0.05 * index}>
                <PortableText
                  value={dp.value}
                  components={datapointComponents}
                />
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
            {hasSummary && (
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
                        <PortableText
                          value={summary}
                          components={portableComponents}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Results */}
            {hasResults && (
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
                        <PortableText
                          value={results}
                          components={portableComponents}
                        />
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
