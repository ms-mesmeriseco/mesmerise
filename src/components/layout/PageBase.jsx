"use client";

import SingleColumn from "@/components/cms-blocks/SingleColumn";
import TwoColumn from "@/components/cms-blocks/TwoColumn";
import IconRow from "@/components/cms-blocks/IconRow";
import AccordionWidget from "@/components/cms-blocks/Accordion";
import SwitchListAccordion from "@/components/cms-blocks/SwitchListAccordion";
import PillBlock from "@/components/cms-blocks/PillBlock";
import SingleCaseStudy from "@/components/cms-blocks/SingleCaseStudy";
import MediaCarouselWithText from "@/components/cms-blocks/MediaCarouselWithText";
import ThreeColumnImage from "@/components/cms-blocks/ThreeColumnImage";
import ComparisonTable from "@/components/cms-blocks/ComparisonTable";
import { motion } from "framer-motion";
import useSectionMarker from "@/hooks/useSectionMarker";

export default function PageBase({ blocks, metadata }) {
  const marker = useSectionMarker();
  const anim = (variants) => {
    return {
      initial: "initial",
      animate: "animate",
      exit: "exit",
      variants,
    };
  };

  const opacity = {
    initial: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
    animate: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      {...anim(opacity)}
      className="flex flex-col items-center justify-center mb-[10rem] md:p-[var(--global-margin-md)] sm:p-[var(--global-margin-lg)] md:mt-[var(--header-height)] pt-12"
    >
      <main className="wrapper grid grid-cols-12 flex flex-col lg:gap-y-[10rem] md:gap-y-[4rem] gap-y-[4rem] w-full">
        {blocks.map((block, index) => {
          switch (block.__typename) {
            case "SingleColumnBlockBlank":
              return (
                <div
                  marker={marker}
                  className="col-span-12"
                  key={`block-${index}`}
                >
                  <SingleColumn
                    content={block.contentCollection?.items || []}
                    align={block.align}
                    ctaLab={block.ctaLab}
                  />
                </div>
              );

            case "TwoColumnBlockBlank":
              return (
                <div className="col-span-12" key={`block-${index}`}>
                  <TwoColumn
                    column1={block.column1Collection?.items || []}
                    column2={block.column2Collection?.items || []}
                    align={block.blockAlignment}
                    ctaLab={block.ctaLab}
                    ctaCol={block.ctaCol}
                  />
                </div>
              );

            case "IconRow":
              return (
                <div className="col-span-12" key={`block-${index}`}>
                  <IconRow
                    columnNumber={block.columnNumber}
                    titleText={block.titleText || []}
                    iconItems={block.iconItemsCollection?.items || []}
                    displayTwo={block.displayTwo}
                  />
                </div>
              );

            case "ListWithImageSwitch":
              return (
                <div className="col-span-12" key={`block-${index}`}>
                  <SwitchListAccordion
                    items={block.listItemsCollection?.items || []}
                  />
                </div>
              );

            case "AccordionWidget":
              return (
                <div className="col-span-12" key={`block-${index}`}>
                  <AccordionWidget
                    icon={block.icon}
                    accordionItems={
                      block.accordionContentCollection?.items || []
                    }
                  />
                </div>
              );

            case "PillBlock":
              const pills = [];
              if (block.pillOne && block.pillOneContent?.json) {
                pills.push({
                  label: block.pillOne,
                  content: block.pillOneContent.json,
                  media: block.pillOneMedia || null,
                });
              }
              if (block.pillTwo && block.pillTwoContent?.json) {
                pills.push({
                  label: block.pillTwo,
                  content: block.pillTwoContent.json,
                  media: block.pillTwoMedia || null,
                });
              }
              if (block.pillThree && block.pillThreeContent?.json) {
                pills.push({
                  label: block.pillThree,
                  content: block.pillThreeContent.json,
                  media: block.pillThreeMedia || null,
                });
              }
              if (block.pillFour && block.pillFourContent?.json) {
                pills.push({
                  label: block.pillFour,
                  content: block.pillFourContent.json,
                  media: block.pillFourMedia || null,
                });
              }
              const assetMap = {};
              (block?.links?.assets?.block || []).forEach((asset) => {
                assetMap[asset.sys.id] = asset;
              });
              return (
                <div className="col-span-12" key={`block-${index}`}>
                  <PillBlock
                    pills={pills}
                    blockTitle={block.blockTitle}
                    assetMap={assetMap}
                  />
                </div>
              );
            case "SingleCaseStudy":
              return (
                <div className="col-span-12" key={`block-${index}`}>
                  <SingleCaseStudy
                    study={block}
                    summary={block.summary}
                    results={block.results}
                    timeFrame={block.timeFrame}
                  />
                </div>
              );
            case "ThreeColumnBlockBlank":
              return (
                <div className="col-span-12" key={`block-${index}`}>
                  <ThreeColumnImage
                    textContentOne={block.textContentOne}
                    textContentTwo={block.textContentTwo}
                    textContentThree={block.textContentThree}
                    mediaCollection={block.mediaCollection}
                  />
                </div>
              );
            case "MediaCarouselWithText":
              if (
                block.mediaContentCollection?.items &&
                block.mediaContentCollection.items.length > 0
              ) {
                return (
                  <div className="col-span-12" key={`block-${index}`}>
                    <MediaCarouselWithText
                      mediaContentCollection={block.mediaContentCollection}
                    />
                  </div>
                );
              }
              return null;
            default:
              return null;
            case "ComparisonTable":
              return (
                <div className="col-span-12" key={`block-${index}`}>
                  <ComparisonTable
                    richTxt={block.richTxt}
                    column1={block.column1}
                    column2={block.column2}
                    title1={block.title1}
                    title2={block.title2}
                  />
                </div>
              );
          }
        })}
      </main>
    </motion.div>
  );
}
