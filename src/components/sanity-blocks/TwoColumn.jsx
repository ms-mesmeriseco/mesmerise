"use client";

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

// Decide whether this is a Sanity block array or "manual" React content
function renderColumnContent(content) {
  if (!content) return null;

  const arr = Array.isArray(content) ? content : [content];

  const looksLikeSanityBlocks =
    arr.length > 0 &&
    arr.every(
      (item) => item && typeof item === "object" && "_type" in item // basic sanity block sniff
    );

  // Sanity mode → let BlockRenderer handle it
  if (looksLikeSanityBlocks) {
    return <BlockRenderer block={content} />;
  }

  // Manual mode → treat entries as React children
  return arr.map((child, i) => <div key={child?.key ?? i}>{child}</div>);
}

export default function TwoColumn({
  column1 = [],
  column2 = [],
  marker = "mesmerise",
  ctaCol,
  ctaLab,
  h2,
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
      <div className="flex flex-col gap-12" data-marker={marker}>
        {h2 && (
          <div className="w-full text-center">
            <h2>{h2}</h2>
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 md:gap-24 gap-6 items-start">
          {/* Column 1 */}
          <div className="blockAlignment flex flex-col gap-6">
            {renderColumnContent(column1)}
            {showCTA && place === true && CTA}
          </div>

          {/* Column 2 */}
          <div className="blockAlignment flex flex-col gap-6">
            {renderColumnContent(column2)}
            {showCTA && place === false && CTA}
          </div>
        </section>
      </div>
    </InView>
  );
}
