import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export default function TwoColumn({ column1 = [], column2 = [] }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 m-(--global-margin)">
      {/* Column 1 */}
      <div className="flex flex-col gap-6">
        {column1.map((block, index) => (
          <BlockRenderer key={`col1-${index}`} block={block} />
        ))}
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-6">
        {column2.map((block, index) => (
          <BlockRenderer key={`col2-${index}`} block={block} />
        ))}
      </div>
    </section>
  );
}

// Helper component to render any block type
function BlockRenderer({ block }) {
  switch (block.__typename) {
    case "ContentTypeRichText":
      return documentToReactComponents(block.content?.json);
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
    default:
      return null;
  }
}
