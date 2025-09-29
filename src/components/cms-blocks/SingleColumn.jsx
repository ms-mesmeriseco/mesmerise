import InView from "@/hooks/InView";
import useSectionMarker from "@/hooks/useSectionMarker";
import BlockRenderer from "@/lib/utils/BlockRenderer";

export default function SingleColumn({
  content = [],
  marker = "mesmerise",
  align,
}) {
  const sectionMarker = useSectionMarker(marker);
  const blockAlignment = [
    align
      ? "w-full m-auto flex flex-col gap-6 min-h-[50vh] justify-around"
      : "w-full m-auto flex flex-col gap-6 min-h-[50vh]",
  ];

  return (
    <InView>
      <section
        data-label={marker}
        className="w-full m-auto flex flex-col gap-2 py-18"
      >
        {content.map((block, index) => (
          <BlockRenderer key={`single-${index}`} block={block} center={align} />
        ))}
      </section>
    </InView>
  );
}
