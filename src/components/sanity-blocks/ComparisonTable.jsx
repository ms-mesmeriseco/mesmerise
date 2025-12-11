"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import InView from "@/hooks/InView";

// Header rich text (above the table)
const headerComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-2 text-sm text-[var(--mesm-l-grey)] leading-snug">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 text-xl font-semibold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 text-lg font-semibold">{children}</h3>
    ),
  },
};

// ✅ THIS is the only logic that replaces bullets with ticks / crosses
function makeColumnComponents(variant) {
  const isPositive = variant === "positive";

  return {
    // Wrap bullet lists in ul
    list: {
      bullet: ({ children }) => (
        <ul className="flex flex-col gap-2">{children}</ul>
      ),
    },

    // Replace bullet marker with icon + pill styles
    listItem: {
      bullet: ({ children }) => (
        <li
          className="
            flex items-center gap-4
            rounded-2xl bg-black/20 border border-white/10
            px-4 py-2 no-list w-full
            transition-opacity
          "
        >
          <span
            aria-hidden="true"
            className={`
              inline-flex h-7 w-7 shrink-0 items-center justify-center
              rounded-full ring-1 text-[var(--background)] text-sm font-bold
              ${
                isPositive
                  ? "bg-[var(--accent)] ring-[var(--accent)]/50"
                  : "bg-[var(--mesm-red)] ring-[var(--mesm-red)]/50"
              }
            `}
          >
            <Image
              src={
                isPositive ? "/icons/check-black.png" : "/icons/close-black.png"
              }
              alt=""
              width={32}
              height={32}
            />
          </span>

          {/* The actual text of the list item */}
          <span className="text-md leading-snug">{children}</span>

          <span className="sr-only">
            {isPositive ? " (included)" : " (not included)"}
          </span>
        </li>
      ),
    },

    // If someone adds non-list blocks inside the column
    block: {
      h3: ({ children }) => (
        <h3 className="mb-2 text-base font-semibold">{children}</h3>
      ),
      normal: ({ children }) => (
        <p className="mb-1 text-sm leading-snug">{children}</p>
      ),
    },
  };
}

export default function ComparisonTable({
  richTxt = [],
  positive = [],
  negative = [],
  title1,
  title2,
}) {
  const hasHeader = Array.isArray(richTxt) && richTxt.length > 0;
  const hasPositive = Array.isArray(positive) && positive.length > 0;
  const hasNegative = Array.isArray(negative) && negative.length > 0;

  if (!hasHeader && !hasPositive && !hasNegative) return null;

  return (
    <InView>
      <section className="flex-col flex justify-center items-center">
        {/* Full-width header */}
        {hasHeader && (
          <div className="mb-8 text-center max-w-3xl">
            <PortableText value={richTxt} components={headerComponents} />
          </div>
        )}

        {/* Two comparison columns */}
        <div className="gap-12 md:gap-12 grid grid-cols-1 md:grid-cols-2">
          {/* Column 1 */}
          <div className="border-1 rounded-2xl border-[var(--mesm-grey-dk)]/50 hover:border-[var(--mesm-grey-dk)] duration-200 bg-[var(--accent)]/20  md:p-6 p-4">
            {title1 && (
              <h3 className="mb-4 w-full text-center text-[var(--foreground)]">
                {title1}
              </h3>
            )}
            {hasPositive && (
              <PortableText
                value={positive}
                components={makeColumnComponents("positive")}
              />
            )}
          </div>

          {/* Column 2 */}
          <div className="border-1 rounded-2xl border-[var(--mesm-grey-dk)]/50 hover:border-[var(--mesm-grey-dk)] duration-200 bg-[var(--mesm-red)]/20 md:p-6 p-4">
            {title2 && <h3 className="mb-4 w-full text-center">{title2}</h3>}
            {hasNegative && (
              <PortableText
                value={negative}
                components={makeColumnComponents("negative")}
              />
            )}
          </div>
        </div>
      </section>
    </InView>
  );
}
