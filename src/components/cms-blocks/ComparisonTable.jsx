"use client";

import React, { useMemo } from "react";
import InView from "@/hooks/InView";

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
                  flex items-start gap-4
                  rounded-md bg-black/20 border border-white/10
                  px-3 py-2  no-list
                "
                >
                  <span
                    aria-hidden="true"
                    className="
                    mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center
                    rounded-full bg-emerald-500/20 ring-1 ring-emerald-400/50
                    text-emerald-300 text-sm font-bold
                  "
                  >
                    ✓
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
                  flex items-start gap-4
                  rounded-md bg-black/20 border border-white/10
                  px-3 py-2 no-list
                "
                >
                  <span
                    aria-hidden="true"
                    className="
                    mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center
                    rounded-full bg-rose-500/20 ring-1 ring-rose-400/50
                    text-rose-300 text-sm font-bold
                  "
                  >
                    ✕
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
