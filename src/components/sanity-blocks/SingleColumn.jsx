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
    <div className="w-full items-end justify-center mt-6">
      <Button href="/connect" variant="accent2" size="large">
        {ctaLab || "Learn More"}
      </Button>
    </div>
  );

  return (
    <InView>
      <section
        data-marker={marker}
        className="w-full m-auto flex flex-col justify-center gap-2 py-18"
      >
        {/* pass the whole PT array to BlockRenderer */}
        <BlockRenderer block={content} center={align} />

        {ctaLab && CTA}
      </section>
    </InView>
  );
}
