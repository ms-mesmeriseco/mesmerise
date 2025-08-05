"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";

export default function ExpandingCard({
  icon,
  title,
  children,
  expansionIcon,
  rotation = 180,
  expandedContent,
  defaultExpanded = false,
  ...props
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      className="flex flex-col  bg-[var(--mesm-grey-xd)] py-4 px-8 rounded-2xl shadowtransition duration-100  hover:translate-x-[2px] hover:bg-[var(--mesm-grey-dk)]"
      {...props}
    >
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex justify-between items-center h-auto py-2 text-left transition text-md hover:opacity-70  cursor-pointer "
        aria-expanded={expanded}
        type="button"
      >
        <div className="flex items-center gap-4">
          {icon?.url && (
            <Image
              src={icon.url}
              alt={icon.title || "Icon"}
              width={32}
              height={32}
              className="object-contain"
            />
          )}
          <span className="font-medium">{title}</span>
        </div>
        {expansionIcon?.url ? (
          <Image
            src={expansionIcon.url}
            alt={expansionIcon.title || "Expand"}
            width={16}
            height={16}
            className={`transition-transform duration-300 ${
              expanded ? `rotate-[${rotation}deg]` : ""
            }`}
            style={{
              transform: expanded ? `rotate(${rotation}deg)` : "none",
            }}
          />
        ) : (
          <span
            className={`text-2xl font-light transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          >
            {expanded ? "×" : "+"}
          </span>
        )}
      </button>
      <div
        className={`transition-opacity duration-300 [&>p+p]:mt-4 ${
          expanded ? "opacity-100 py-3" : "opacity-0 h-0 overflow-hidden p-0"
        }`}
        style={{
          pointerEvents: expanded ? "auto" : "none",
          transitionProperty: "opacity, height, padding",
        }}
      >
        {expanded && (expandedContent || children)}
      </div>
    </div>
  );
}

ExpandingCard.propTypes = {
  icon: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
  }),
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  expansionIcon: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
  }),
  rotation: PropTypes.number,
  expandedContent: PropTypes.node,
  defaultExpanded: PropTypes.bool,
};
