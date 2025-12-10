// src/components/layout/PageBase.jsx
"use client";

import SingleColumn from "@/components/sanity-blocks/SingleColumn";
import TwoColumn from "@/components/sanity-blocks/TwoColumn";
import IconRow from "@/components/sanity-blocks/IconRow";
import AccordionWidget from "@/components/sanity-blocks/Accordion";
import SwitchListAccordion from "@/components/sanity-blocks/SwitchListAccordion";
import PillBlock from "@/components/sanity-blocks/PillBlock";
import SingleCaseStudy from "@/components/sanity-blocks/SingleCaseStudy";
import MediaCarouselWithText from "@/components/sanity-blocks/MediaCarouselWithText";
import ComparisonTable from "@/components/sanity-blocks/ComparisonTable";
import { motion } from "framer-motion";
import useSectionMarker from "@/hooks/useSectionMarker";

export default function PageBase({ blocks, metadata }) {
  const marker = useSectionMarker();
  const anim = (variants) => ({
    initial: "initial",
    animate: "animate",
    exit: "exit",
    variants,
  });

  const opacity = {
    initial: { opacity: 0, transition: { duration: 0.2 } },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };
  console.log("PageBase blocks:", blocks);

  return (
    <motion.div
      {...anim(opacity)}
      className="flex flex-col items-center justify-center mb-[10rem] md:mt-[var(--header-height)] pt-12"
    >
      <main className="narrow-wrapper grid grid-cols-12 lg:gap-y-[10rem] md:gap-y-[4rem] gap-y-[4rem] w-full">
        {blocks.map((block, index) => {
          const type = block._type;

          switch (type) {
            // 1️⃣ SINGLE COLUMN
            case "singleColumnBlockBlank":
              return (
                <div
                  marker={marker}
                  className="col-span-12"
                  key={block._id || `block-${index}`}
                >
                  <SingleColumn
                    content={block.content || []} // refs resolved in GROQ
                    align={block.align}
                    ctaLab={block.ctaLab}
                  />
                </div>
              );

            // 2️⃣ TWO COLUMN
            case "twoColumnBlockBlank": {
              return (
                <div
                  marker={marker}
                  className="col-span-12"
                  key={block._id || `block-${index}`}
                >
                  <TwoColumn
                    column1={block.column1 || []}
                    column2={block.column2 || []}
                    align={block.align}
                    ctaLab={block.ctaLab}
                    ctaCol={block.ctaCol}
                    h2={block.h2}
                  />
                </div>
              );
            }

            // 💯 ICON ROW
            case "iconRow":
              return (
                <div
                  className="col-span-12"
                  key={block._id || `block-${index}`}
                >
                  <IconRow
                    columnNumber={block.columnNumber}
                    titleText={block.titleText || []}
                    iconItems={block.iconItems || []}
                    displayTwo={block.displayTwo}
                  />
                </div>
              );

            // ✨ LIST WITH IMAGE SWITCH
            case "listWithImageSwitch":
              return (
                <div
                  className="col-span-12"
                  key={block._id || `block-${index}`}
                >
                  <SwitchListAccordion
                    items={block.listItems || []}
                    title={block.title}
                  />
                </div>
              );

            // 🪗 ACCORDION
            case "accordionWidget":
              return (
                <div
                  className="col-span-12"
                  key={block._id || `block-${index}`}
                >
                  <AccordionWidget
                    icon={block.icon}
                    accordionItems={block.accordionContent || []}
                  />
                </div>
              );

            // 💊 PILL BLOCK
            case "pillBlock": {
              const pills = [];

              if (block.pillOne && block.pillOneContent) {
                pills.push({
                  label: block.pillOne,
                  content: block.pillOneContent,
                  media: block.pillOneMedia
                    ? { url: block.pillOneMedia }
                    : null,
                });
              }

              if (block.pillTwo && block.pillTwoContent) {
                pills.push({
                  label: block.pillTwo,
                  content: block.pillTwoContent,
                  media: block.pillTwoMedia
                    ? { url: block.pillTwoMedia }
                    : null,
                });
              }

              if (block.pillThree && block.pillThreeContent) {
                pills.push({
                  label: block.pillThree,
                  content: block.pillThreeContent,
                  media: block.pillThreeMedia
                    ? { url: block.pillThreeMedia }
                    : null,
                });
              }

              if (block.pillFour && block.pillFourContent) {
                pills.push({
                  label: block.pillFour,
                  content: block.pillFourContent,
                  media: block.pillFourMedia
                    ? { url: block.pillFourMedia }
                    : null,
                });
              }

              if (!pills.length) return null;

              return (
                <div
                  className="col-span-12"
                  key={block._id || `block-${index}`}
                >
                  <PillBlock pills={pills} blockTitle={block.blockTitle} />
                </div>
              );
            }

            case "singleCaseStudy":
              return (
                <SingleCaseStudy
                  key={block._id}
                  study={block}
                  summary={block.summary}
                  results={block.results}
                  timeFrame={block.timeFrame}
                />
              );
            // 🎠 MEDIA CAROUSEL
            case "mediaCarouselWithText": {
              const mediaItems = block.mediaContent || [];

              if (!mediaItems.length) return null;

              return (
                <div
                  className="col-span-12"
                  key={block._id || `block-${index}`}
                >
                  <MediaCarouselWithText
                    mediaContentCollection={{ items: mediaItems }}
                  />
                </div>
              );
            }

            // case "comparisonTable": {
            //   return (
            //     <ComparisonTable
            //       richTxt={block.richTxt}
            //       positive={block.positive}
            //       negative={block.negative}
            //       title1={block.title1}
            //       title2={block.title2}
            //       key={block._id || `block-${index}`}
            //     />
            //   );
            // }
            default:
              return null;
          }
        })}
      </main>
    </motion.div>
  );
}
