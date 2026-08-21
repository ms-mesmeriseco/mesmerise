"use client";

import AwarenessDiagram from "@/components/blocks/AwarenessDiagram";

export default function Pyramid({ block }) {
  const eyebrow = block?.eyebrow;
  const heading = block?.heading;

  return (
    <div className="flex flex-col items-center text-center gap-6 w-full">
      {(eyebrow || heading) && (
        <div className="flex flex-col gap-2">
          {eyebrow && <h5>{eyebrow}</h5>}
          {heading && <h3>{heading}</h3>}
        </div>
      )}
      <AwarenessDiagram />
    </div>
  );
}
