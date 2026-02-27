"use client";

import { isValidElement } from "react";
import { PortableText } from "@portabletext/react";

function renderItemContent(textContent) {
  if (!textContent) return null;

  // Plain string
  if (typeof textContent === "string") {
    return <p className="text-sm/6 opacity-80">{textContent}</p>;
  }

  // JSX / React node
  if (isValidElement(textContent)) {
    return textContent;
  }

  // If your "richText" field is an object like { _type: "...", content: [...] }
  if (
    typeof textContent === "object" &&
    !Array.isArray(textContent) &&
    Array.isArray(textContent.content)
  ) {
    const normalizedBlocks = textContent.content.map((node, idx) => ({
      ...node,
      _key: node._key ? `${node._key}-${idx}` : `threecol-block-${idx}`,
    }));

    return <PortableText value={normalizedBlocks} />;
  }

  // Sanity Portable Text array
  if (Array.isArray(textContent)) {
    const normalizedBlocks = textContent.map((node, idx) => ({
      ...node,
      _key: node._key ? `${node._key}-${idx}` : `threecol-block-${idx}`,
    }));

    return <PortableText value={normalizedBlocks} />;
  }

  return null;
}

export default function ThreeColumnImagesBlock({ block }) {
  if (!block) return null;

  const {
    textContentOne,
    textContentTwo,
    textContentThree,
    media = [],
  } = block;

  const images = Array.isArray(media)
    ? media.filter((m) => m?.url).slice(0, 3)
    : [];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((img) => (
          <figure key={img._key ?? img.url} className="w-full">
            <img
              src={img.url}
              alt={img.alt || ""}
              className="w-full h-auto"
              loading="lazy"
            />
          </figure>
        ))}

        {images.length < 3 &&
          Array.from({ length: 3 - images.length }).map((_, i) => (
            <div
              key={`placeholder-${i}`}
              className="hidden md:block w-full"
              aria-hidden="true"
            />
          ))}
      </div>

      {(textContentOne || textContentTwo || textContentThree) && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-[var(--mesm-blue)]">
          <div className="text-sm/6 opacity-80">
            {renderItemContent(textContentOne)}
          </div>
          <div className="text-sm/6 opacity-80">
            {renderItemContent(textContentTwo)}
          </div>
          <div className="text-sm/6 opacity-80">
            {renderItemContent(textContentThree)}
          </div>
        </div>
      )}
    </section>
  );
}
