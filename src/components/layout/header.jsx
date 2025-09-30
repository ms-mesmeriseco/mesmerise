"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "../ui/Button";

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const [hydrated, setHydrated] = useState(false);
  const [sceneInView, setSceneInView] = useState(false);

  // Route checks
  const isHome = pathname === "/";
  const isAbout = pathname === "/about" || pathname.startsWith("/about/");
  const isConnect = pathname === "/connect" || pathname.startsWith("/connect/");
  const isServices =
    pathname === "/services" || pathname.startsWith("/services/");
  const isCollab =
    pathname === "/collaboration" || pathname.startsWith("/collaboration/");
  const isWork = pathname === "/work" || pathname.startsWith("/work/");
  const isBlog = pathname === "/blog" || pathname.startsWith("/blog/");
  const showMobileStickyCTA = !(
    isHome ||
    isAbout ||
    isConnect ||
    isServices ||
    isCollab ||
    isWork ||
    isBlog
  );
  const headerCtaClass = !showMobileStickyCTA
    ? "inline-flex"
    : "hidden md:inline-flex";

  const isContact = isConnect;
  const logo = isContact
    ? "/WordMark_Spaced-BLACK.png"
    : "/WordMark_Spaced-WHITE.png";

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

      // account for the negative top rootMargin you use in the IO
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

    const el = document.querySelector("#home-scene");
    if (!el) {
      setSceneInView(false);
      return;
    }

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
  }, [pathname]);

  return (
    <>
      <header
        ref={headerRef}
        className="site-header fixed top-0 left-0 right-0 z-300 w-full box-border
                   grid grid-cols-[auto_1fr_auto] items-center md:py-4 md:px-8
                   px-5 py-4
                   pointer-events-auto bg-transparent"
      >
        {/* Left: Logo (video on non-connect pages, static black on connect) */}
        <Link
          href="/"
          aria-label="Go to homepage"
          className="justify-self-start"
        >
          <img
            src="/assets/270px-transparent_M-logo.gif"
            preload="auto"
            aria-hidden={sceneInView}
            className={[
              "md:h-[4.23rem] h-[2.77rem] block transition-opacity duration-100 opacity-0",
              sceneInView
                ? "opacity-0 pointer-events-none hidden"
                : "opacity-100",
            ].join(" ")}
          ></img>
        </Link>

        {/* Middle: spacer */}
        <span />

        {/* Right: Connect button — visible on desktop/tablet, hidden on mobile */}
        <span className="justify-self-end">
          {!isConnect && (
            <span className={headerCtaClass}>
              <Button
                size="large"
                variant="accent"
                href="/connect"
                extraClass="shadow-xl"
              >
                Connect
              </Button>
            </span>
          )}
        </span>
      </header>

      {/* Mobile sticky CTA (full-width, bottom). Hidden on /, /about, /connect */}
      {showMobileStickyCTA && (
        <div className="fixed bottom-0 left-0 right-0 z-[299] md:hidden pb-6 px-10">
          <div
            className="px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]
                          "
          >
            <Button size="x-large" variant="CTA" href="tel:+61477210477">
              <span className="text-2xl">Call us</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
