"use client";

import HeroBanner from "@/components/blocks/HeroBanner";
import SingleColumn from "@/components/blocks/SingleColumn";
import TwoColumn from "@/components/blocks/TwoColumn";
import IconRow from "@/components/blocks/IconRow";
import TrustBadges from "@/components/blocks/TrustBadges";
import AccordionWidget from "@/components/blocks/Accordion";
import { motion } from "framer-motion"

export default function PageBase({ blocks }) {
  const anim = (variants) => {
        return {
            initial: "initial",
            animate: "animate",
            exit: "exit",
            variants
        }
    }

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
    <motion.div {...anim(opacity)} className="flex flex-col items-center justify-center min-h-screen gap-16">
      <main className="flex flex-col gap-8 w-full">
        {blocks.map((block, index) => {
            // console.log("Block type:", block.__typename);
            // console.log("Block data:", block);
          switch (block.__typename) {
            case "ComponentHeroBanner":
              return (
                <HeroBanner
                  key={`block-${index}`}
                  heroMedia={block.heroMedia}
                  heroText={block.heroText}
                  mediaHeight={block.mediaHeight}
                />
              );

            case "SingleColumnBlockBlank":
              return (
                <SingleColumn
                  key={`block-${index}`}
                  content={block.contentCollection?.items || []}
                />
              );

            case "TwoColumnBlockBlank":
              return (
                <TwoColumn
                  key={`block-${index}`}
                  column1={block.column1Collection?.items || []}
                  column2={block.column2Collection?.items || []}
                />
              );
            case "IconRow":
            return (
              <IconRow
                key={`block-${index}`}
                columnNumber={block.columnNumber}
                contentDirection={block.contentDirection}
                iconItems={block.iconItemsCollection?.items || []}
              />
            );
            case "TrustBadges":
              return (
                <TrustBadges
                  key={`block-${index}`}
                  textContent={block.textContent}
                  logos={block.logosCollection?.items || []}
                  scroll={block.scroll}
                />
              );
            case "AccordionWidget":
              return (
                <AccordionWidget
                  key={`block-${index}`}
                  icon={block.icon}
                  accordionItems={block.accordionContentCollection?.items || []}
                />
              );

            default:
              return null;
          }
        })}
      </main>
    </motion.div>
  );
}
