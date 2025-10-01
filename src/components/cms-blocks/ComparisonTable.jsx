"use client";

import React, { useMemo } from "react";
import InView from "@/hooks/InView";
import Image from "next/image";

/* ---------------- Rich Text helpers ---------------- */
function textFromNode(node) {
  if (!node) return "";
  if (node.nodeType === "text") return node.value || "";
  const kids = node.content || [];
  return kids.map(textFromNode).join("");
}

function collectListItems(node, out) {
  if (!node) return;
  const { nodeType, content = [] } = node;

  // Grab items from lists
  if (nodeType === "unordered-list" || nodeType === "ordered-list") {
    content.forEach((li) => {
      if (li?.nodeType === "list-item") {
        const text = (li.content || [])
          .map((child) =>
            child?.nodeType === "paragraph" ? textFromNode(child).trim() : ""
          )
          .filter(Boolean)
          .join(" ")
          .trim();
        if (text) out.push(text);
      }
    });
  }

  // Recurse
  content.forEach((c) => collectListItems(c, out));
}

function getListItemsFromRichText(doc) {
  const items = [];
  collectListItems(doc, items);
  return items;
}

/* ---------------- Component ---------------- */
export default function ComparisonTable({
  richTxt,
  column1,
  column2,
  title1,
  title2,
}) {
  const list1 = useMemo(
    () => getListItemsFromRichText(column1?.json),
    [column1]
  );
  const list2 = useMemo(
    () => getListItemsFromRichText(column2?.json),
    [column2]
  );

  return (
    <InView>
      <section className="my-8">
        {/* Optional header/intro (rich text) */}
        {richTxt?.json && (
          <div className="mb-4 text-sm text-[var(--mesm-l-grey)]">
            {/* If you want to actually render the full rich text, plug in your renderer here.
              For now we just extract plain text: */}
            {getListItemsFromRichText(richTxt.json).join(" ")}
          </div>
        )}

        <div
          className="
          grid grid-cols-1 md:grid-cols-2 gap-8
          p-4
        "
        >
          {/* Column 1: Ticks */}
          <div>
            <h3 className="mb-3 text-base font-semibold">{title1}</h3>
            <ul className="flex flex-col gap-2">
              {list1.map((item, i) => (
                <li
                  key={`c1-${i}`}
                  className="
                  flex items-center gap-4
                  rounded-2xl bg-black/20 border border-white/10
                  px-4 py-2 no-list w-fit opacity-70 hover:opacity-100 transition-opacity
                "
                >
                  <span
                    aria-hidden="true"
                    className="
                     inline-flex h-7 w-7 shrink-0 items-center justify-center
                    rounded-full bg-[var(--accent)] ring-1 ring-[var(--accent)]/50
                    text-[var(--background)] text-sm font-bold
                  "
                  >
                    <Image
                      src="/icons/check-black.png"
                      alt=""
                      width={32}
                      height={32}
                    />
                  </span>
                  <span className="text-md leading-snug ">{item}</span>
                  <span className="sr-only">(included)</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Crosses */}
          <div>
            <h3 className="mb-3 text-base font-semibold">{title2}</h3>
            <ul className="flex flex-col gap-2">
              {list2.map((item, i) => (
                <li
                  key={`c2-${i}`}
                  className="
                  flex items-center gap-4
                  rounded-2xl bg-black/20 border border-white/10
                  px-4 py-2 no-list w-fit  opacity-70 hover:opacity-100 transition-opacity
                "
                >
                  <span
                    aria-hidden="true"
                    className="
                      inline-flex h-7 w-7 shrink-0 items-center justify-center
                    rounded-full bg-[var(--mesm-red)] ring-1 ring-[var(--mesm-red)]/50
                    text-[var(--background)] text-sm font-bold
                  "
                  >
                    <Image
                      src="/icons/close-black.png"
                      alt=""
                      width={32}
                      height={32}
                    />
                  </span>
                  <span className="text-md leading-snug">{item}</span>
                  <span className="sr-only"> (not included)</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </InView>
  );
}
