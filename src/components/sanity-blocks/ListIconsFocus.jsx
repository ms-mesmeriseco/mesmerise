"use client";

import BlockRenderer from "@/sanity/BlockRenderer";
import InView from "@/hooks/InView";
import { useRef, useState, useLayoutEffect } from "react";

// Space left under each stacked card's title before the next card covers it
const STACK_GAP_PX = 20;
// Used before measuring (first paint) — roughly one line of title
const STACK_FALLBACK_REM = 6;

// Measures each card's "head" (top of card → bottom of its title) and returns the
// sticky top offset for every card, so all previous titles stay fully visible.
function useStackOffsets(count) {
  const itemRefs = useRef([]);
  const [offsets, setOffsets] = useState(null);

  useLayoutEffect(() => {
    const els = itemRefs.current.slice(0, count).filter(Boolean);
    if (!els.length) return;

    const measure = () => {
      let running = 0;
      const next = els.map((li) => {
        const offset = running;
        const head =
          li.querySelector("h3") || li.querySelector("[data-stack-head]");
        const headBottom = head
          ? head.getBoundingClientRect().bottom - li.getBoundingClientRect().top
          : 0;
        running += Math.ceil(headBottom) + STACK_GAP_PX;
        return offset;
      });
      setOffsets((prev) =>
        prev &&
        prev.length === next.length &&
        prev.every((v, i) => v === next[i])
          ? prev
          : next,
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    els.forEach((el) => ro.observe(el));
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [count]);

  return { itemRefs, offsets };
}

// Solid card: number | divider | large title + body, stacks over the previous card on scroll
function StackCard({ number, title, content, icon }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] w-full md:min-h-[22rem] min-h-[18rem] bg-[var(--mesm-blue)] rounded-xl text-[var(--foreground)] shadow-lg shadow-black md:py-4 py-2 md:px-6 px-4 mb-2">
      <span
        data-stack-head
        className=" text-[var(--background)] text-xs tracking-wide md:pb-0 pb-6"
      >
        {number}
      </span>

      <div className="flex flex-col gap-8 bg-[var(--mesm-grey-dk)]/40 p-8 rounded-xl ">
        <div className="flex flex-row gap-4 items-center max-w-md text-pretty">
          {icon && <img src={icon} alt="" className="w-10 h-10" />}

          {title && (
            <h3 className="tracking-tight font-normal text-[var(--background)]">
              {title}
            </h3>
          )}
        </div>
        {content && (
          <p className="text-sm leading-relaxed whitespace-pre-line  text-[var(--background)] max-w-md text-pretty">
            {content}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ListIconsFocus({ block }) {
  const title = block?.title;
  const items = block?.listItems || [];
  const twoColumn = !!block?.twoColumn;
  const sticky = twoColumn && !!block?.stickyTitle;

  const { itemRefs, offsets } = useStackOffsets(items.length);

  if (!items.length && !title) return null;

  const titleBlock = title && (
    <BlockRenderer block={title} center={!twoColumn} />
  );

  const listBlock = (
    <ul className="flex flex-col text-left w-full">
      {items.map((item, index) => {
        const key = item?._key || `${item?._id || "list-icons-focus"}-${index}`;
        const stackOffset = offsets
          ? `${offsets[index] ?? 0}px`
          : `${index * STACK_FALLBACK_REM}rem`;
        return (
          <li
            ref={(el) => (itemRefs.current[index] = el)}
            key={key}
            className="no-list sticky"
            style={{
              top: `calc(var(--header-height) + 1rem + ${stackOffset})`,
            }}
          >
            <StackCard
              number={String(index + 1).padStart(2, "0")}
              title={item?.title}
              content={item?.content}
              icon={item?.icon}
            />
          </li>
        );
      })}
    </ul>
  );

  if (twoColumn) {
    return (
      <InView>
        <div className="narrow-wrapper grid grid-cols-1 md:grid-cols-[3fr_7fr] md:gap-24 gap-6 items-start">
          <div
            className={
              sticky
                ? "md:sticky pt-6 md:top-[calc(var(--header-height)+2rem)]"
                : ""
            }
          >
            {titleBlock}
          </div>
          <div>{listBlock}</div>
        </div>
      </InView>
    );
  }

  return (
    <InView>
      <div className="narrow-wrapper flex flex-col items-center gap-6">
        {titleBlock}
        {listBlock}
      </div>
    </InView>
  );
}
