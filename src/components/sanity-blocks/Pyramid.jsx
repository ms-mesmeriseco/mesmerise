"use client";

import AwarenessDiagram from "@/components/blocks/AwarenessDiagram";
import InView from "@/hooks/InView";
import { PortableText } from "@portabletext/react";

export default function Pyramid({ block }) {
  const text = block?.richTxt;
  const normalizedText =
    Array.isArray(text) && text.length > 0
      ? text.map((node, idx) => ({
          ...node,
          _key: node._key ? `${node._key}-${idx}` : `pyramid-block-${idx}`,
        }))
      : null;

  return (
    <InView>
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="text-center">
          {normalizedText && <PortableText value={normalizedText} />}
        </div>
        <AwarenessDiagram />
      </div>
    </InView>
  );
}
