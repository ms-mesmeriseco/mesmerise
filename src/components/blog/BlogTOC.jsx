"use client";
import { useEffect, useRef, useState } from "react";

export default function BlogTOC({ anchors }) {
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const scrollRef = useRef(null);

  function handleAnchorClick(e, id) {
    e.preventDefault();
    const headerHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height",
        ),
      ) || 64;
    const el = document.getElementById(id);
    if (el) {
      const y =
        el.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function onScroll() {
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
      setAtTop(el.scrollTop <= 10);
      setAtBottom(nearBottom);
    }

    onScroll();
    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [anchors]);

  // Fade anchors out at the top/bottom edges when there's more to scroll
  const fadeSize = "72px";
  const maskImage = `linear-gradient(to bottom, ${
    atTop ? "black" : "transparent"
  } 0, black ${fadeSize}, black calc(100% - ${fadeSize}), ${
    atBottom ? "black" : "transparent"
  } 100%)`;

  if (!anchors?.length) return null;

  return (
    <>
      <span className="">
        <h6>CONTENTS</h6>
      </span>
      <div className="relative w-fit self-start mb-8">
        <nav
          ref={scrollRef}
          className="flex flex-col gap-4 p-4 w-fit max-h-[65vh] min-h-[400px] overflow-y-scroll pr-6"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        >
          {anchors.map((anchor) => (
            <div
              key={anchor.id}
              className=" rounded-xl border-1 border-white/8 hover:translate-x-[2px] px-1 py-2 text-left text-[var(--foreground)] hover:text-[var(--background)] hover:bg-[var(--mesm-yellow)] duration-300 flex flex-row items-start gap-2"
            >
              <div className="w-[8px] h-[8px] text-[var(--foreground)] border-[var(--mesm-grey-dk)] border-1 p-[2px] m-[5px] rounded-full bg-black "></div>
              <a
                href={`#${anchor.id}`}
                onClick={(e) => handleAnchorClick(e, anchor.id)}
                title={anchor.text}
                className="min-w-0"
              >
                <h6 className="line-clamp-2">{anchor.text}</h6>
              </a>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
