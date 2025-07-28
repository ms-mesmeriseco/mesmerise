import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { INLINES } from "@contentful/rich-text-types";

// Utility to replace line breaks with <br />
function replaceLineBreaks(text) {
  const parts = text.split("\n");
  return parts.flatMap((part, index) =>
    index > 0 ? [<br key={index} />, part] : [part]
  );
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
