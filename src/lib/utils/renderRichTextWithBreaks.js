import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import Image from "next/image";

function replaceLineBreaks(text) {
  return text.split("\n").reduce((acc, segment, index) => {
    if (index > 0) acc.push(<br key={`br-${index}`} />);
    acc.push(segment);
    return acc;
  }, []);
}

// Accept optional assetMap for embedded assets
export function getRichTextOptions(assetMap = {}) {
  return {
    renderText: (text) => replaceLineBreaks(text),
    renderNode: {
      [INLINES.HYPERLINK]: (node, children) => {
        const url = node.data.uri;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[0.35rem] text-[var(--accent)] no-underline"
          >
            <span className="relative link-text">
              {children}
              <span className="absolute left-0 bottom-[-2px] h-[1px] w-full bg-[var(--accent)] transform scale-x-0 origin-left transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-x-100 peer-hover:scale-x-100"></span>
            </span>
            <Image
              src="/icons/north_east_24dp_C1D2FC_FILL0_wght300_GRAD-25_opsz24.svg"
              alt=""
              width={16}
              height={16}
              className="inline-arrow"
            />
          </a>
        );
      },
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const assetId = node.data.target.sys.id;
        const asset = assetMap[assetId];
        if (!asset) return null;
        const { url, title, description, width, height, contentType } = asset;

        if (contentType?.startsWith("image/")) {
          return (
            <div className="my-6">
              <Image
                src={url}
                alt={title || description || "Embedded image"}
                width={width}
                height={height}
                className="w-full h-auto rounded-xl"
              />
            </div>
          );
        }

        if (contentType?.startsWith("video/")) {
          return (
            <div className="my-6">
              <video
                controls
                width={width}
                height={height}
                className="w-full h-auto rounded-xl max-h-[80vh]"
              >
                <source src={url} type={contentType} />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        }

        return null; // fallback for unsupported types
      },
    },
  };
}

// Accept assetMap for flexibility
export default function renderRichTextWithBreaks(richText, assetMap = {}) {
  if (!richText) return null;
  return documentToReactComponents(richText, getRichTextOptions(assetMap));
}
