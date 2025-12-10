"use client";

import ListCard from "@/components/ui/ListCard";
import { motion, useInView } from "framer-motion";
import { useRef, isValidElement } from "react";
import { PortableText } from "@portabletext/react";

function renderItemContent(textContent) {
  if (!textContent) return null;

  // Plain string
  if (typeof textContent === "string") {
    return <p>{textContent}</p>;
  }

  // JSX / React node
  if (isValidElement(textContent)) {
    return textContent;
  }

  // Sanity Portable Text array
  if (Array.isArray(textContent)) {
    const normalizedBlocks = textContent.map((node, idx) => ({
      ...node,
      _key: node._key ? `${node._key}-${idx}` : `list-icon-block-${idx}`,
    }));

    return <PortableText value={normalizedBlocks} />;
  }

  return null;
}

export default function ListIcons({ items = [] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.03 } },
  };

  const child = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.ul
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className="grid grid-cols-1 sm:grid-cols-1 gap-2"
    >
      {items.map((item, index) => {
        const key = item?._key || `list-icon-${index}`;
        const { icon, textContent, entryTitle } = item || {};

        return (
          <motion.li variants={child} key={key} className="no-list">
            <ListCard icon={icon} entryTitle={entryTitle}>
              {renderItemContent(textContent)}
            </ListCard>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
