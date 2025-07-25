import { INLINES } from "@contentful/rich-text-types";

export function getRichTextOptions() {
  return {
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
