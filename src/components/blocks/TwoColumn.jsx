import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import AccordionWidget from "./Accordion";
import ListIcons from "./ListIcons";
import IconRow from "./IconRow";

export default function TwoColumn({ column1 = [], column2 = [] }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Column 1 */}
      <div className="flex flex-col gap-6">
        {column1.map((block, index) => (
          <BlockRenderer key={`col1-${index}`} block={block} index={index} />
        ))}
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-6">
        {column2.map((block, index) => (
          <BlockRenderer key={`col2-${index}`} block={block} index={index} />
        ))}
      </div>
    </section>
  );
}

// Helper component to render any block type
function BlockRenderer({ block, index }) {
  switch (block.__typename) {
    case "ContentTypeRichText":
      return (
        <div className="prose max-w-none">
          {documentToReactComponents(block.content?.json)}
        </div>
      );
    case "Image":
      return (
        <img
          src={block.imageContent?.url}
          alt={block.imageContent?.title || ""}
          className="w-full h-auto rounded-(--radius-sm) shadow"
        />
      );
    case "Video":
      return (
        <video
          src={block.videoContent?.url}
          controls
          className="w-1/2 h-auto rounded-(--radius-sm) shadow"
        >
          Your browser does not support the video tag.
        </video>
      );
    case "ListIcons":
      return <ListIcons items={block.listItemsCollection?.items || []} />;
    case "IconRow":
      return (
        <IconRow
          key={`icon-row-${index}`}
          columnNumber={block.columnNumber}
          contentDirection={block.contentDirection}
          iconItems={block.iconItemsCollection?.items || []}
        />
      );
    case "AccordionWidget":
      return (
        <AccordionWidget
          key={`accordion-${index}`}
          icon={block.icon}
          accordionItems={block.accordionContentCollection?.items || []}
        />
      );
    default:
      return null;
  }
}
