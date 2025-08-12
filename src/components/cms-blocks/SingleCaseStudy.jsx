"use client";

import { useState } from "react";
import Image from "next/image";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";

export default function SingleCaseStudy({
  study,
  summary,
  results,
  timeFrame,
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
    <section className="flex flex-col md:flex-row gap-4 wrapper">
      {/* Left (Hero image with 16:9 ratio) */}
      <div className="relative w-full md:w-3/4 aspect-[6/4] overflow-hidden rounded-xl">
        {heroMedia?.url && (
          <Image
            src={heroMedia.url}
            alt={heroMedia.title || "Case Study Image"}
            fill
            className="object-cover rounded-xl aspect-6/19"
            sizes="(max-width: 768px) 100vw, 75vw"
          />
        )}

        <div className="flex flex-row gap-12 absolute bottom-4 left-4 backdrop-blur p-4 rounded-2xl shadow-md text-sm">
          {dataOne?.json && <div>{renderRichTextWithBreaks(dataOne.json)}</div>}
          {dataTwo?.json && <div>{renderRichTextWithBreaks(dataTwo.json)}</div>}
          {dataThree?.json && (
            <div>{renderRichTextWithBreaks(dataThree.json)}</div>
          )}
        </div>
      </div>

      {/* Right (Project info + dropdowns) */}
      <div className="md:w-1/4 space-y-4 p-4">
        <h3 className="text-lg font-semibold m-0">{projectTitle}</h3>
        <span className="bg-[var(--mesm-red)] text-[var(--background)] text-sm py-2 px-4 rounded-full">
          {formattedDate} – {collaborationModel ? "Defined" : "Ongoing"}
        </span>

        {/* Collapsibles */}
        {projectScope?.json && (
          <div className="text-xs flex flex-col gap-4 mt-4">
            {/* Summary dropdown */}
            <div className="border border-[var(--mesm-grey-dk)] rounded-md">
              <button
                className="w-full text-left px-3 py-2 flex justify-between items-center bg-[var(--mesm-grey-xd)] hover:bg-[var(--mesm-grey-dk)] transition"
                onClick={() => setShowSummary(!showSummary)}
              >
                <h6 className="text-xs m-0">SUMMARY</h6>
                <span>{showSummary ? "▲" : "▼"}</span>
              </button>
              {showSummary && (
                <div className="px-3 py-2">
                  {renderRichTextWithBreaks(summary.json)}
                </div>
              )}
            </div>

            {/* Results dropdown */}
            <div className="border border-[var(--mesm-grey-dk)] rounded-md">
              <button
                className="w-full text-left px-3 py-2 flex justify-between items-center bg-[var(--mesm-grey-xd)] hover:bg-[var(--mesm-grey-dk)] transition"
                onClick={() => setShowResults(!showResults)}
              >
                <h6 className="text-xs m-0">RESULTS OVER {timeFrame}</h6>
                <span>{showResults ? "▲" : "▼"}</span>
              </button>
              {showResults && (
                <div className="px-3 py-2">
                  {renderRichTextWithBreaks(results.json)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
