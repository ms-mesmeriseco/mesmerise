"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatedArrow } from "../ui/Button";

// How far to scroll the homepage hero out of view (in viewport heights)
// before the bar appears
const HOME_HERO_SCROLL = 0.2;

// Sitewide bar pinned to the bottom of the screen, into the tools gateway.
// It slides in on every page change, and on the homepage only once the hero
// has been scrolled past.
export default function ToolsBanner() {
  const pathname = usePathname() || "/";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);

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
  }, [pathname]);

  return (
    <div
      className={[
        "fixed bottom-0 left-0 right-0 z-[298] transition-transform duration-500 ease-out motion-reduce:transition-none",
        visible ? "translate-y-0" : "translate-y-full pointer-events-none",
      ].join(" ")}
      aria-hidden={!visible}
    >
      <Link
        href="/tools/start"
        tabIndex={visible ? undefined : -1}
        className="group flex items-center justify-center gap-3 rounded-t-xl md:rounded-t-2xl px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]
                   bg-[var(--accent)] text-[var(--background)] text-sm md:text-lg
                   hover:bg-[var(--accent-l)] transition-colors duration-200"
      >
        <span>Not sure if your marketing is working?</span>
        <span className="inline-flex items-center underline">
          Find out in a few minutes
          <AnimatedArrow />
        </span>
      </Link>
    </div>
  );
}
