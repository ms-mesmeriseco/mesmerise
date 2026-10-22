"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatedArrow } from "../ui/Button";

// How far to scroll the homepage hero out of view (in viewport heights)
// before the bar appears
const HOME_HERO_SCROLL = 0.2;

// Closing the bar hides it for the rest of the visit (this tab's session)
const DISMISSED_KEY = "tools-banner-dismissed";

// Gap kept between the bar and the footer's last line
const FOOTER_GAP = 16;

function readDismissed() {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

// Sitewide bar pinned to the bottom of the screen, into the tools gateway.
// It slides in on every page change, and on the homepage only once the hero
// has been scrolled past. While it's showing, its height is published as
// --tools-banner-h (and --tools-banner-space, with the footer gap) so the
// footer and the mobile CTA can sit above it.
export default function ToolsBanner() {
  const pathname = usePathname() || "/";
  const barRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(readDismissed());
  }, []);

  useEffect(() => {
    setVisible(false);
    if (dismissed) return;

    if (pathname === "/") {
      const handleScroll = () =>
        setVisible(window.scrollY > window.innerHeight * HOME_HERO_SCROLL);
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }

    // Short pause so the slide reads as a new arrival on each page
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, [pathname, dismissed]);

  // Keep the published height in step with the bar across screen sizes
  useEffect(() => {
    const root = document.documentElement.style;
    const publish = () => {
      const h = visible ? barRef.current?.offsetHeight || 0 : 0;
      root.setProperty("--tools-banner-h", `${h}px`);
      root.setProperty(
        "--tools-banner-space",
        h ? `${h + FOOTER_GAP}px` : "0px",
      );
    };
    publish();
    if (!visible || !barRef.current) return;
    const observer = new ResizeObserver(publish);
    observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [visible]);

  // Clear the space when the bar unmounts (pages without it)
  useEffect(
    () => () => {
      const root = document.documentElement.style;
      root.setProperty("--tools-banner-h", "0px");
      root.setProperty("--tools-banner-space", "0px");
    },
    [],
  );

  function dismiss() {
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {}
    setDismissed(true);
  }

  return (
    <div
      ref={barRef}
      className={[
        "fixed bottom-0 left-0 right-0 z-[298] transition-transform duration-500 ease-out motion-reduce:transition-none",
        visible ? "translate-y-0" : "translate-y-full pointer-events-none",
      ].join(" ")}
      aria-hidden={!visible}
    >
      <Link
        href="/tools/start"
        tabIndex={visible ? undefined : -1}
        className="group flex items-center justify-center gap-3 rounded-t-xl md:rounded-t-2xl pl-3 pr-11 md:px-14 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]
                   bg-[var(--accent)] text-[var(--background)] text-xs md:text-lg
                   hover:bg-[var(--accent-l)] transition-colors duration-200"
      >
        <span>Not sure if your marketing is working?</span>
        <span className="inline-flex items-center underline">
          Find out in a few minutes
          <AnimatedArrow />
        </span>
      </Link>

      {/* Close: an outline circle like an unselected quiz answer, filling red on hover */}
      <button
        type="button"
        onClick={dismiss}
        tabIndex={visible ? undefined : -1}
        aria-label="Close banner"
        className="group/close absolute right-3 md:right-4 top-3 md:top-3.5 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full border
                   border-[var(--background)]/35 text-[var(--background)]/55 cursor-pointer duration-200
                   hover:bg-[var(--mesm-red)] hover:border-[var(--mesm-red)] hover:text-white
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--background)]"
      >
        <svg
          viewBox="0 0 12 12"
          aria-hidden="true"
          className="w-2 h-2 md:w-2.5 md:h-2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        >
          <path d="M2 2l8 8M10 2l-8 8" />
        </svg>
      </button>
    </div>
  );
}
