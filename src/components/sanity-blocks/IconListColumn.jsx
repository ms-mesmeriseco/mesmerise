"use client";

import ListCard from "@/components/ui/ListCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  isValidElement,
} from "react";
import { PortableText } from "@portabletext/react";
import InView from "@/hooks/InView";

gsap.registerPlugin(ScrollTrigger);

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
      _key: node._key ? `${node._key}-${idx}` : `icon-list-column-block-${idx}`,
    }));

    return <PortableText value={normalizedBlocks} />;
  }

  return null;
}

export default function IconListColumn({ block }) {
  const eyebrow = block?.eyebrow;
  const heading = block?.heading;
  const twoColumn = !!block?.direction;
  const items = block?.listItems || [];

  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const [centerIndex, setCenterIndex] = useState(null);

  const updateCenter = useCallback(() => {
    if (!itemRefs.current.length) return;
    const viewportCenter = window.innerHeight / 2;

    let bestIdx = null;
    let bestDist = Infinity;
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const dist = Math.abs(itemCenter - viewportCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });
    setCenterIndex(bestIdx);
  }, []);

  const rafRef = useRef(null);
  const updateCenterSafe = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateCenter);
  }, [updateCenter]);

  useEffect(() => {
    updateCenterSafe();
    window.addEventListener("scroll", updateCenterSafe, { passive: true });
    window.addEventListener("resize", updateCenterSafe);
    return () => {
      window.removeEventListener("scroll", updateCenterSafe);
      window.removeEventListener("resize", updateCenterSafe);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateCenterSafe, items.length]);

  // --- ENTRANCE: fade + slide up, staggered, once scrolled into view ---
  useEffect(() => {
    const targets = itemRefs.current.filter(Boolean);
    if (!targets.length) return;

    gsap.set(targets, { opacity: 0, y: 10 });
    const tl = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.03,
      ease: "power2.out",
      scrollTrigger: {
        trigger: listRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      tl.kill();
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
    };
  }, [items.length]);

  if (!items.length && !heading && !eyebrow) return null;

  const headingBlock = (eyebrow || heading) && (
    <div className="flex flex-col gap-2">
      {eyebrow && <h5>{eyebrow}</h5>}
      {heading && <h3>{heading}</h3>}
    </div>
  );

  const listBlock = (
    <ul ref={listRef} className="grid grid-cols-1 gap-2 text-left">
      {items.map((item, index) => {
        const key = item?._id || item?._key || `icon-list-column-${index}`;
        const { icon, textContent, entryTitle } = item || {};

        const isFocused = centerIndex === null || centerIndex === index;

        return (
          <li
            ref={(el) => (itemRefs.current[index] = el)}
            key={key}
            className="no-list"
          >
            <div
              style={{
                transform: isFocused ? "scale(1)" : "scale(0.98)",
                transition: "0.3s ease-in-out",
              }}
            >
              <ListCard icon={icon} entryTitle={entryTitle}>
                {renderItemContent(textContent)}
              </ListCard>
            </div>
          </li>
        );
      })}
    </ul>
  );

  if (twoColumn) {
    return (
      <div className="narrow-wrapper grid grid-cols-1 md:grid-cols-2 md:gap-24 gap-6 items-start">
        <div className="md:sticky md:top-[var(--header-height)]">
          {headingBlock}
        </div>
        <div>{listBlock}</div>
      </div>
    );
  }

  return (
    <InView>
      <div className="narrow-wrapper flex flex-col items-center text-center gap-6">
        {headingBlock}
        {listBlock}
      </div>
    </InView>
  );
}
