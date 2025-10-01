import InView from "@/hooks/InView";
import BlockRenderer from "@/lib/utils/BlockRenderer";
import Button from "../ui/Button";

function boolOrNull(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true") return true;
    if (s === "false") return false;
  }
  return null; // null/undefined/other → no CTA
}

export default function TwoColumn({
  column1 = [],
  column2 = [],
  align,
  ctaCol,
  ctaLab,
}) {
  const place = boolOrNull(ctaCol); // true | false | null
  const showCTA = place !== null;

  const CTA = (
    <div className="w-full flex items-end justify-start mt-2">
      <Button href={"/connect"} variant="accent2" size="large">
        {ctaLab || "Learn More"}
      </Button>
    </div>
  );
  return (
    <InView>
      <section className="grid grid-cols-1 md:grid-cols-2 md:gap-24 gap-6 items-start">
        {/* Column 1 */}
        <div className="blockAlignment flex flex-col gap-6">
          {column1.map((block, index) => (
            <BlockRenderer
              key={`col1-${index}`}
              block={block}
              index={index}
              center={align}
            />
          ))}

          {showCTA && place === true && CTA}
        </div>

        {/* Column 2 */}
        <div className="blockAlignment flex flex-col gap-6">
          {column2.map((block, index) => (
            <BlockRenderer
              key={`col2-${index}`}
              block={block}
              index={index}
              center={align}
            />
          ))}
          {showCTA && place === false && CTA}
        </div>
      </section>
    </InView>
  );
}
