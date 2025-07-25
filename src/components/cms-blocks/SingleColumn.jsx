import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import ListIcons from "./ListIcons";
import IconRow from "@/components/cms-blocks/IconRow";
import InView from "@/hooks/InView";
import useSectionMarker from "@/hooks/useSectionMarker";
import { getRichTextOptions } from "@/lib/utils/richTextOptions";

export default function SingleColumn({ content = [], marker = "mesmerise" }) {
  const sectionMarker = useSectionMarker(marker);
  return (
    <InView>
      <section
        data-label={marker}
        className="wrapper w-full m-auto flex flex-col gap-6 min-h-[50vh] justify-around"
      >
        {content.map((block, index) => (
          <BlockRenderer key={`single-${index}`} block={block} />
        ))}
      </section>
    </InView>
  );
}

function BlockRenderer({ block }) {
  switch (block.__typename) {
    case "ContentTypeRichText":
      return (
        <div className="m-auto prose max-w-none text-center lg:w-6/12 md:w-8/12 sm:w-10/12 gap-4 flex flex-col">
          {documentToReactComponents(block.content?.json, getRichTextOptions())}
        </div>
      );
    case "Image":
      return (
        <img
          src={block.imageContent?.url}
          alt={block.imageContent?.title || ""}
          className="w-full h-auto rounded-lg shadow"
        />
      );
    case "Video":
      return (
        <video
          src={block.videoContent?.url}
          controls
          className="w-1/2 h-auto rounded-lg shadow"
        >
          Your browser does not support the video tag.
        </video>
      );
    case "ListIcons":
      return (
        <div className="m-auto">
          <ListIcons items={block.listItemsCollection?.items || []} />
        </div>
      );
    case "IconRow":
      return (
        <IconRow
          key={`block-${index}`}
          iconItems={block.iconItemsCollection?.items || []}
        />
      );
    default:
      return null;
  }
}
