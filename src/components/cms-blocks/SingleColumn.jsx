import InView from "@/hooks/InView";
import useSectionMarker from "@/hooks/useSectionMarker";
import BlockRenderer from "@/lib/utils/BlockRenderer";
import Button from "../ui/Button";

export default function SingleColumn({
  content = [],
  marker = "mesmerise",
  align,
  ctaLab,
}) {
  const sectionMarker = useSectionMarker(marker);
  const blockAlignment = [
    align
      ? "w-full m-auto flex flex-col gap-6 min-h-[50vh] justify-around"
      : "w-full m-auto flex flex-col gap-6 min-h-[50vh]",
  ];

  const CTA = (
    <div className="w-full flex items-end justify-center mt-6">
      <Button href={"/connect"} variant="primary" size="large">
        {ctaLab || "Learn More"}
      </Button>
    </div>
  );

  return (
    <InView>
      <section
        data-label={marker}
        className="w-full m-auto flex flex-col gap-2 py-18"
      >
        {content.map((block, index) => (
          <BlockRenderer key={`single-${index}`} block={block} center={align} />
        ))}

        {ctaLab && CTA}
      </section>
    </InView>
  );
}
