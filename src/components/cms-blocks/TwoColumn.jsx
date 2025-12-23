"use client";

import { isValidElement } from "react";
import InView from "@/hooks/InView";
import BlockRenderer from "@/sanity/BlockRenderer";
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

// Helper: decide how to render each item
function renderBlockOrNode(item, index, align, colKey) {
  // If it's already JSX/React element, just render it
  if (isValidElement(item)) {
    return (
      <div key={`node-${colKey}-${index}`} className="w-full">
        {item}
      </div>
    );
  }

  // Otherwise assume it's a "block" for BlockRenderer
  const key = item?._id || `block-${colKey}-${index}`;

  return <BlockRenderer key={key} block={item} index={index} center={align} />;
}

export default function TwoColumn({
  column1 = [],
  column2 = [],
  align,
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

  // Make sure we always have arrays (Sanity refs resolved by GROQ)
  const col1Items = column1 || [];
  const col2Items = column2 || [];

  return (
    <InView>
      <div className="flex flex-col gap-12">
        {h2 && (
          <div className="w-full text-center">
            <h2>{h2}</h2>
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-6 items-start">
          {/* Column 1 */}
          <div className="blockAlignment flex flex-col gap-6">
            {col1Items.map((item, index) =>
              renderBlockOrNode(item, index, align, "c1")
            )}
            {showCTA && place === true && CTA}
          </div>

          {/* Column 2 */}
          <div className="blockAlignment flex flex-col gap-6">
            {col2Items.map((item, index) =>
              renderBlockOrNode(item, index, align, "c2")
            )}
            {showCTA && place === false && CTA}
          </div>
        </section>
      </div>
    </InView>
  );
}
