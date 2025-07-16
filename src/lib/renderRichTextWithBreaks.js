import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import React from "react";

// Utility to replace line breaks with <br />
function replaceLineBreaks(text) {
  const parts = text.split("\n");
  return parts.flatMap((part, index) =>
    index > 0 ? [<br key={index} />, part] : [part]
  );
}

// Main rendering helper
export default function renderRichTextWithBreaks(richText) {
  if (!richText) return null;

  const options = {
    renderText: (text) => replaceLineBreaks(text),
  };

  return documentToReactComponents(richText, options);
}
