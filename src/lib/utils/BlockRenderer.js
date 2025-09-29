import ListIcons from "@/components/cms-blocks/ListIcons";
import IconRow from "@/components/cms-blocks/IconRow";
import AccordionWidget from "@/components/cms-blocks/Accordion";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import renderRichTextWithBreaks from "./renderRichTextWithBreaks";

export default function BlockRenderer({ block, center }) {
  const textAlign = center
    ? "m-auto prose max-w-none text-center w-10/12 gap-4 flex flex-col"
    : "prose max-w-none lg:w-12/12 md:w-12/12 sm:w-12/12";
  const widgetAlign = center ? " " : "w-full";

  switch (block.__typename) {
    case "ContentTypeRichText":
      return (
        <div className={`[&>p+p]:mt-4 [&>*]:mb-4 ${textAlign}`}>
          {renderRichTextWithBreaks(block.content?.json)}
        </div>
      );
    case "Image":
      return (
        <Image
          src={block.imageContent?.url}
          alt={block.imageContent?.title || ""}
          width={block.imageContent?.width || 600}
          height={block.imageContent?.height || 400}
          className={`w-full h-auto shadow rounded-md aspect-[6/4] object-cover`}
        />
      );
    case "Video":
      return (
        <video
          src={block.videoContent?.url}
          controls
          className="w-1/2 h-auto shadow"
        >
          Your browser does not support the video tag.
        </video>
      );
    case "ListIcons":
      return (
        <div className={`m-auto ${widgetAlign}`}>
          <ListIcons items={block.listItemsCollection?.items || []} />
        </div>
      );
    case "IconRow":
      return (
        <IconRow
          key={`block`}
          iconItems={block.iconItemsCollection?.items || []}
        />
      );
    case "AccordionWidget":
      return (
        <AccordionWidget
          key={`accordion`}
          icon={block.icon}
          accordionItems={block.accordionContentCollection?.items || []}
        />
      );
    default:
      return null;
  }
}
