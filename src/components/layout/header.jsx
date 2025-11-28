"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "../ui/Button";
import MenuToggle from "../ui/MenuToggle";

export default function Header() {
  const pathname = usePathname() || "/";
  const headerRef = useRef(null);
  const [hydrated, setHydrated] = useState(false);
  const [sceneInView, setSceneInView] = useState(false);
  const [scrolledEnough, setScrolledEnough] = useState(false);

  const starts = (p) => pathname === p || pathname.startsWith(`${p}/`);

  // known (non-landing) sections
  const KNOWN_PREFIXES = [
    "/", // home
    "/about",
    "/connect",
    "/services",
    "/collaboration",
    "/work",
    "/blog",
  ];

  const isKnownRoute = KNOWN_PREFIXES.some((p) => starts(p));
  const isLanding = !isKnownRoute;

  const showMobileStickyCTA = isLanding;

  // ---- Measure header height and scene ----
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const el = document.querySelector("#home-scene");
    const raw = getComputedStyle(document.documentElement).getPropertyValue(
      "--header-height"
    );
    const headerH = parseInt(raw) || 0;

    let inView = false;
    if (el) {
      const rect = el.getBoundingClientRect();
      const vpH = window.innerHeight || document.documentElement.clientHeight;

      const top = rect.top - headerH;
      const bottom = rect.bottom;
      inView = bottom > 0 && top < vpH;
    }
    setSceneInView(inView);
    setHydrated(true);
  }, [pathname]);

  useLayoutEffect(() => {
    if (headerRef.current) {
      const h = headerRef.current.offsetHeight;
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Track scene
    const el = document.querySelector("#home-scene");
    if (!el) {
      setSceneInView(false);
    } else {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(
        "--header-height"
      );
      const headerH = parseInt(raw) || 0;

      const io = new IntersectionObserver(
        ([entry]) => {
          setSceneInView(entry.isIntersecting && entry.intersectionRatio > 0);
        },
        { root: null, rootMargin: `-${headerH}px 0px 0px 0px`, threshold: [0] }
      );
      io.observe(el);
      return () => io.disconnect();
    }
  }, [pathname]);

  // ---- Track scroll position (100vh) ----
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const trigger = window.innerHeight; // 100vh in px
      setScrolledEnough(window.scrollY >= trigger);
    };

    handleScroll(); // run on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="site-header fixed top-0 left-0 right-0 z-300 w-full box-border
                   grid grid-cols-[auto_1fr_auto] items-center pt-[var(--global-margin-xs)] px-[var(--global-margin-sm)] 
                   pointer-events-auto bg-transparent"
      >
        {/* Left: Logo */}
        <div className="min-h-[3.23rem]">
          <Link
            href="https://www.mesmeriseco.com/"
            aria-label="Go to homepage"
            className="justify-self-start"
          >
            <img
              src="/assets/270px-transparent_M-logo.gif"
              preload="auto"
              aria-hidden={sceneInView}
              className={[
                "md:h-[3.23rem] h-[2.77rem] block transition-opacity duration-100 opacity-0",
                sceneInView
                  ? "opacity-0 pointer-events-none hidden"
                  : "opacity-100",
              ].join(" ")}
            />
          </Link>
        </div>

        {/* Middle: spacer */}
        <span />

        {/* Right: Header CTAs */}
        <span className="justify-self-end">
          <span className={"inline-flex gap-3"}>
            {/* Connect: now ALWAYS rendered */}
            <MenuToggle />
            <Button
              size="large"
              variant="accent"
              href="/connect"
              extraClass="shadow-xl"
            >
              Connect
            </Button>
          </span>
        </span>
      </header>

      {/* Mobile sticky CTA (non-landing pages only, after 100vh) */}
      {showMobileStickyCTA && scrolledEnough && (
        <div className="fixed bottom-0 left-0 right-0 z-[299] md:hidden pb-6 px-10">
          <div className="px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
            <Button size="x-large" variant="CTA" href="tel:+61477210477">
              <span className="text-2xl">Speak to Simba</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
