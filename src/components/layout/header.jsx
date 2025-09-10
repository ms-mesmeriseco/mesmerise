"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "../ui/Button";

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const [sceneInView, setSceneInView] = useState(false);

  const isContact = pathname === "/connect";
  const blackLogo = "/WordMark_Spaced-BLACK.png";

  // Track the home scene's visibility (if present)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const el = document.querySelector("#home-scene");
    // If there is no scene on this page, ensure logo video shows
    if (!el) {
      setSceneInView(false);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        // Any intersection hides the header video
        setSceneInView(entry.isIntersecting && entry.intersectionRatio > 0);
      },
      {
        root: null,
        // threshold: [0]  // any intersection (default behavior)
        // If you want to hide ONLY when fully visible and show as soon as it’s < 100%:
        // threshold: [1.0]
        threshold: [0],
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  // Expose header height (if you rely on it for layout offset)
  useLayoutEffect(() => {
    if (headerRef.current) {
      const h = headerRef.current.offsetHeight;
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    }
  }, []);

  // Optional: provide default top padding if you haven't elsewhere
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.paddingTop;
    if (!prev) root.style.paddingTop = "var(--header-height)";
    return () => {
      root.style.paddingTop = prev;
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="site-header fixed top-0 h-fit left-0 right-0 z-300 w-full box-border
                 grid grid-cols-[auto_1fr_auto] items-center md:py-4 md:px-8 px-4 py-2
                 pointer-events-auto bg-black shadow-lg/20"
    >
      {/* Left: Logo */}
      <Link href="/" aria-label="Go to homepage" className="justify-self-start">
        <video
          src="/assets/glassBSDF_transparent-320px.mp4"
          className={[
            "h-[4rem] block transition-opacity duration-500",
            sceneInView ? "opacity-0 pointer-events-none" : "opacity-100",
          ].join(" ")}
          aria-hidden={sceneInView}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </Link>

      {/* Middle: spacer */}
      <span />

      {/* Right: Connect button (hide on /connect if you want) */}
      <span className="justify-self-end">
        {isContact ? null : (
          <Button
            size="large"
            variant="accent"
            href="/connect"
            extraClass="shadow-xl"
          >
            Connect
          </Button>
        )}
      </span>
    </header>
  );
}
