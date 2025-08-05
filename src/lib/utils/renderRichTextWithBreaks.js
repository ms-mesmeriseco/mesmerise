import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import Image from "next/image";
import ExpandingCard from "@/components/ui/ExpandingCard";
import ListCard from "@/components/ui/ListCard";

function replaceLineBreaks(text) {
  return text.split("\n").reduce((acc, segment, index) => {
    if (index > 0) acc.push(<br key={`br-${index}`} />);
    acc.push(segment);
    return acc;
  }, []);
}

// Extended options for headings with anchors (used in blog)
function generateAnchorId(text = "") {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

// Accept optional assetMap and context
export function getRichTextOptions(assetMap = {}, context = {}) {
  const isBlog = context.blog;
  const entryMap = context.entryMap || {};

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
              className="inline-arrow p-[1px]"
              aria-hidden="true"
            />
          </a>
        );
      },

      ...(isBlog && {
        [BLOCKS.HEADING_3]: (node, children) => {
          const text = node.content?.map((c) => c.value || "").join("") || "";
          const id = generateAnchorId(text);
          return <h3 id={id}>{children}</h3>;
        },
      }),

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
                className="w-full h-auto rounded-md"
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

        return null;
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        const entryId = node.data.target.sys.id;
        const entry = entryMap[entryId];
        if (!entry) return null;

        switch (entry.__typename) {
          case "AccordionItem":
            return (
              <ExpandingCard
                title={entry.entryTitle}
                expandedContent={documentToReactComponents(
                  entry.textContent?.json
                )}
              />
            );

          case "ListIconItem":
            return (
              <ListCard icon={entry.icon} outline="true">
                {documentToReactComponents(entry.textContent?.json)}
              </ListCard>
            );

          default:
            return null;
        }
      },
    },
  };
}

// Accept assetMap and optional context (e.g. { blog: true })
export default function renderRichTextWithBreaks(
  richText,
  assetMap = {},
  context = {}
) {
  if (!richText) return null;
  const options = getRichTextOptions(assetMap, context);
  return documentToReactComponents(richText, options);
}
