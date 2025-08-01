import Image from "next/image";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";

export default function SingleCaseStudy({ study, summary, results, timeFrame }) {
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
  } = caseStudy;

  const formattedDate = new Date(study.caseStudy.projectDate).toLocaleString("en-AU", {
    year: "numeric",
    });

  return (
    <section className="flex flex-col md:flex-row gap-4">
      {/* Left (Image + overlay) */}
      <div
  className="relative w-full md:w-3/4 h-[400px] md:h-auto rounded-xl bg-cover bg-center"
  style={{
    backgroundImage: `url(${heroMedia?.url})`,
  }}
>
        <div className="flex flex-row gap-12 absolute bottom-4 left-4 backdrop-blur p-4 rounded-2xl shadow-md space-y-2 text-sm">
          {dataOne?.json && <div>{renderRichTextWithBreaks(dataOne.json)}</div>}
          {dataTwo?.json && <div>{renderRichTextWithBreaks(dataTwo.json)}</div>}
          {dataThree?.json && <div>{renderRichTextWithBreaks(dataThree.json)}</div>}
        </div>
      </div>

      {/* Right (Details) */}
      <div className="md:w-1/4 space-y-4 p-4">
        <h3 className="text-lg font-semibold">{projectTitle}</h3>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
        {projectScope?.json && (
          <div className="text-sm flex flex-col gap-2">
            <h6>SUMMARY</h6>
            {renderRichTextWithBreaks(summary.json)}
             <h6>RESULTS OVER {timeFrame}</h6>
            {renderRichTextWithBreaks(results.json)}
          </div>
        )}
      </div>
    </section>
  );
}
