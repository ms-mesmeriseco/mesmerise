"use client";

import HeroBanner from "@/components/cms-blocks/HeroBanner";
import SingleColumn from "@/components/cms-blocks/SingleColumn";
import TwoColumn from "@/components/cms-blocks/TwoColumn";
import IconRow from "@/components/cms-blocks/IconRow";
import TrustBadges from "@/components/cms-blocks/TrustBadges";
import AccordionWidget from "@/components/cms-blocks/Accordion";
import { motion } from "framer-motion";
import useSectionMarker from "@/hooks/useSectionMarker";
import SwitchListAccordion from "@/components/cms-blocks/SwitchListAccordion";

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
      className="flex flex-col items-center justify-center min-h-screen  md:p-[var(--global-margin-md)] sm:p-[var(--global-margin-lg)]"
    >
      <main className="grid grid-cols-12 flex flex-col lg:gap-y-[10rem] md:gap-y-[6rem] gap-y-[4rem] w-full">
        {blocks.map((block, index) => {
          console.log(block);
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
                  />
                </div>
              );

            case "TwoColumnBlockBlank":
              return (
                <div className="col-span-12" key={`block-${index}`}>
                  <TwoColumn
                    column1={block.column1Collection?.items || []}
                    column2={block.column2Collection?.items || []}
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

            default:
              return null;
          }
        })}
      </main>
    </motion.div>
  );
}
