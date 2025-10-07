import InView from "@/hooks/InView";
import BlockRenderer from "@/lib/utils/BlockRenderer";
import Button from "../ui/Button";

export default function SingleColumn({
  content = [],
  marker = "mesmerise",
  align,
  ctaLab,
}) {
  const CTA = (
    <div className="w-full flex items-end justify-center mt-6">
      <Button href={"/connect"} variant="primary" size="large">
        {ctaLab || "Learn More"}
      </Button>
    </div>
  );

  return (
    <InView>
      <section className="w-full m-auto flex flex-col gap-2 py-18">
        {content.map((block, index) => (
          <BlockRenderer key={`single-${index}`} block={block} center={align} />
        ))}

        {ctaLab && CTA}
      </section>
    </InView>
  );
}
