"use client";

import HeroBanner from "@/components/cms-blocks/HeroBanner";
import SingleColumn from "@/components/cms-blocks/SingleColumn";
import TwoColumn from "@/components/cms-blocks/TwoColumn";
import IconRow from "@/components/cms-blocks/IconRow";
import TrustBadges from "@/components/cms-blocks/TrustBadges";
import AccordionWidget from "@/components/cms-blocks/Accordion";
import SwitchListAccordion from "@/components/cms-blocks/SwitchListAccordion";
import PillBlock from "@/components/cms-blocks/PillBlock";
import { motion } from "framer-motion";
import useSectionMarker from "@/hooks/useSectionMarker";

export default function PageBase({ blocks }) {
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
      className="flex flex-col items-center justify-center min-h-screen  md:p-[var(--global-margin-md)] sm:p-[var(--global-margin-lg)] md:mt-[var(--header-height)]"
    >
      <main className="grid grid-cols-12 flex flex-col lg:gap-y-[10rem] md:gap-y-[6rem] gap-y-[4rem] w-full">
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
                    align={block.blockAlignment}
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
                  />
                </div>
              );

            case "IconRow":
              return (
                <div className="col-span-12" key={`block-${index}`}>
                  <IconRow
                    columnNumber={block.columnNumber}
                    blockTitle={block.entryTitle}
                    iconItems={block.iconItemsCollection?.items || []}
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
                pills.push({ label: block.pillOne, content: block.pillOneContent.json });
              }
              if (block.pillTwo && block.pillTwoContent?.json) {
                pills.push({ label: block.pillTwo, content: block.pillTwoContent.json });
              }
              if (block.pillThree && block.pillThreeContent?.json) {
                pills.push({ label: block.pillThree, content: block.pillThreeContent.json });
              }
              if (block.pillFour && block.pillFourContent?.json) {
                pills.push({ label: block.pillFour, content: block.pillFourContent.json });
              }
              const assetMap = {};
              (block?.links?.assets?.block || []).forEach((asset) => {
                assetMap[asset.sys.id] = asset;
              });
              return (
                <div className="col-span-12" key={`block-${index}`}>
                  <PillBlock pills={pills} assetMap={assetMap} />
                </div>
              );

            default:
              return null;
          }
        })}
      </main>
    </motion.div>
  );
}