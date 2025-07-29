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
      ? "wrapper w-full m-auto flex flex-col gap-6 min-h-[50vh] justify-around"
      : "wrapper w-full m-auto flex flex-col gap-6 min-h-[50vh]",
  ];

  console.log("ALGINMENT: ", blockAlignment, align);
  return (
    <InView>
      <section
        data-label={marker}
        className="wrapper w-full m-auto flex flex-col gap-6 min-h-[50vh] justify-around"
      >
        {content.map((block, index) => (
          <BlockRenderer key={`single-${index}`} block={block} center={align} />
        ))}
      </section>
    </InView>
  );
}
