"use client";

import { useState } from "react";
import Image from "next/image";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";

export default function SingleCaseStudy({
  study,
  summary,
  results,
  timeFrame,
  showText,
}) {
  const { caseStudy } = study;
  if (!caseStudy) return null;

  const {
    heroMedia,
    projectTitle,
    projectDate,
    projectScope,
    dataOne,
    dataTwo,
    dataThree,
    collaborationModel,
  } = caseStudy;

  const formattedDate = new Date(projectDate).toLocaleString("en-AU", {
    year: "numeric",
  });

  const [showSummary, setShowSummary] = useState(false);
  const [showResults, setShowResults] = useState(false);

  return (
    <section className="relative w-full aspect-[6/4] overflow-hidden rounded-xl">
      {/* Background Image */}
      {heroMedia?.url && (
        <Image
          src={heroMedia.url}
          alt={heroMedia.title || "Case Study Image"}
          fill
          className="object-cover rounded-xl duration-300"
          sizes="100vw"
          priority
        />
      )}

      {/* Top Left: Data Points */}
      <div className="absolute top-4 left-4 flex flex-col gap-3 backdrop-blur bg-white/10 p-4 rounded-xl shadow text-sm max-w-[60vw]">
        {dataOne?.json && <div>{renderRichTextWithBreaks(dataOne.json)}</div>}
        {dataTwo?.json && <div>{renderRichTextWithBreaks(dataTwo.json)}</div>}
        {dataThree?.json && (
          <div>{renderRichTextWithBreaks(dataThree.json)}</div>
        )}
      </div>

      {/* Top Right: Project Title & Date */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2"></div>

      {/* Bottom Right: Collapsibles */}

      <div className="absolute bottom-4 right-4 w-[320px] max-w-[90vw] text-xs flex flex-col gap-4">
        <h3 className="text-lg font-bold m-0">{projectTitle}</h3>
        <span className="bg-[var(--mesm-blue)] text-[var(--background)] text-sm py-1 px-3 rounded-md w-fit">
          {formattedDate} – {collaborationModel ? "Defined" : "Ongoing"}
        </span>

        {/* Only show if projectScope exists */}

        {projectScope?.json && (
          <>
            {/* Summary dropdown */}
            <div className="">
              <button
                className="w-full text-left px-3 py-1 flex justify-between items-center cursor-pointer border-b-1"
                onClick={() => setShowSummary(!showSummary)}
              >
                <h5 className="text-xs m-0">Summary</h5>
                <h5>{showSummary ? "-" : "+"}</h5>
              </button>
              {showSummary && (
                <div className="px-3 py-2">
                  {renderRichTextWithBreaks(summary.json)}
                </div>
              )}
            </div>

            {/* Results dropdown */}
            <div className="">
              <button
                className="w-full text-left px-3 py-1 flex justify-between items-center cursor-pointer border-b-1"
                onClick={() => setShowResults(!showResults)}
              >
                <h5 className="text-xs m-0">Results</h5>
                <h5>{showResults ? "-" : "+"}</h5>
              </button>
              {showResults && (
                <div className="px-3 py-2">
                  {timeFrame}
                  {renderRichTextWithBreaks(results.json)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
