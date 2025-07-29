import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { INLINES } from "@contentful/rich-text-types";

function replaceLineBreaks(text) {
  console.log("Rendering rich text with line breaks:", text); // DEBUG LOG
  return text.split("\n").reduce((acc, segment, index) => {
    if (index > 0) acc.push(<br key={`br-${index}`} />);
    acc.push(segment);
    return acc;
  }, []);
}
// Combined render options
export function getRichTextOptions() {
  return {
    renderText: (text) => replaceLineBreaks(text),
    renderNode: {
      [INLINES.HYPERLINK]: (node, children) => {
        const url = node.data.uri;
        return (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      },
    },
  };
}

// Main rendering helper
export default function renderRichTextWithBreaks(richText) {
  if (!richText) return null;
  return documentToReactComponents(richText, getRichTextOptions());
}
