import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import ListIcons from "./ListIcons";
import IconRow from "@/components/cms-blocks/IconRow";
import AccordionWidget from "@/components/cms-blocks/Accordion";
import InView from "@/hooks/InView";
import useSectionMarker from "@/hooks/useSectionMarker";
import { getRichTextOptions } from "@/lib/utils/richTextOptions";
import BlockRenderer from "@/lib/utils/BlockRenderer";

export default function SingleColumn({ content = [], marker = "mesmerise" }) {
  const sectionMarker = useSectionMarker(marker);
  return (
    <InView>
      <section
        data-label={marker}
        className="wrapper w-full m-auto flex flex-col gap-6 min-h-[50vh] justify-around"
      >
        {content.map((block, index) => (
          <BlockRenderer key={`single-${index}`} block={block} center={true} />
        ))}
      </section>
    </InView>
  );
}
