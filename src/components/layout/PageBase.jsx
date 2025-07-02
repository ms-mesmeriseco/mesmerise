import HeroBanner from "@/components/blocks/HeroBanner";
import SingleColumn from "@/components/blocks/SingleColumn";
import TwoColumn from "@/components/blocks/TwoColumn";
import IconRow from "@/components/blocks/IconRow";
import TrustBadges from "@/components/blocks/TrustBadges";

export default function PageBase({ blocks }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-16">
      <main className="flex flex-col gap-8 w-full">
        {blocks.map((block, index) => {
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
              )

            default:
              return null;
          }
        })}
      </main>
    </div>
  );
}
