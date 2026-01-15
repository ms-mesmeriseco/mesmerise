"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { PortableText } from "@portabletext/react";
import ExpandingCard from "@/components/ui/ExpandingCard";

// Reuse a light PT config just for this widget
const portableComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-2 leading-snug last:mb-0">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-1">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const target = value?.target || "_self";
      const rel = target === "_blank" ? "noopener noreferrer" : undefined;

      const isInternal = href.startsWith("/") || href.startsWith("#");

      const content = (
        <span className="underline underline-offset-2 hover:decoration-solid">
          {children}
        </span>
      );

      if (isInternal) {
        // If you're using next/link here, you can swap for <Link>
        return <a href={href}>{content}</a>;
      }

      return (
        <a href={href} target={target} rel={rel}>
          {content}
        </a>
      );
    },
  },
};

// Helper to handle a couple of possible shapes for textContent
function AccordionBody({ value }) {
  if (!value) return null;

  // 1) Most likely: array of PT blocks
  if (Array.isArray(value)) {
    return <PortableText value={value} components={portableComponents} />;
  }

  // 2) If you ever wired it as a richText document:
  //    { _type: "richText", content: [blocks] }
  if (value._type === "richText") {
    const blocks = value.content || [];
    return <PortableText value={blocks} components={portableComponents} />;
  }

  // 3) Legacy: stored as HTML string
  if (typeof value === "string") {
    return <div dangerouslySetInnerHTML={{ __html: value }} />;
  }

  return null;
}

export default function AccordionWidget({
  icon,
  accordionItems = [],
  rotation = 180,
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  if (!accordionItems.length) return null;

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 ">
        {accordionItems.map((item, index) => {
          const { entryTitle, textContent } = item || {};

          const expandedContent = <AccordionBody value={textContent} />;

          return (
            <ExpandingCard
              key={item._id || `accordion-item-${index}`}
              title={entryTitle}
              expansionIcon={icon}
              rotation={rotation}
              expandedContent={expandedContent}
              defaultExpanded={activeIndex === index}
              onClick={() => toggleIndex(index)}
            />
          );
        })}
      </div>
    </section>
  );
}

AccordionWidget.propTypes = {
  icon: PropTypes.string,
  accordionItems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      entryTitle: PropTypes.string,
      // PT array OR richText doc OR string fallback
      textContent: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
        PropTypes.string,
      ]),
    })
  ),
  rotation: PropTypes.number,
};
