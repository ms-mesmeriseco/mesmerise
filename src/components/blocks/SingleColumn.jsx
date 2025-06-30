import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import ListIcons from "./ListIcons";

export default function SingleColumn({ content = [] }) {
  return (
    <section className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      {content.map((block, index) => (
        <BlockRenderer key={`single-${index}`} block={block} />
      ))}
    </section>
  );
}

function BlockRenderer({ block }) {
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
    default:
      return null;
  }
}
