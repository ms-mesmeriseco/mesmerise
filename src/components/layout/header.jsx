"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "../ui/Button";

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef(null);

  // Route checks
  const isHome = pathname === "/";
  const isAbout = pathname === "/about" || pathname.startsWith("/about/");
  const isConnect = pathname === "/connect" || pathname.startsWith("/connect/");
  const isServices =
    pathname === "/services" || pathname.startsWith("/services/");
  const isCollab =
    pathname === "/collaboration" || pathname.startsWith("/collaboration/");
  const showMobileStickyCTA = !(
    isHome ||
    isAbout ||
    isConnect ||
    isServices ||
    isCollab
  ); // 👈 show on all other pages
  const headerCtaClass = !showMobileStickyCTA
    ? "inline-flex"
    : "hidden md:inline-flex";

  // Logo colour: black on /connect, white elsewhere (your existing rule)
  const isContact = isConnect;
  const logo = isContact
    ? "/WordMark_Spaced-BLACK.png"
    : "/WordMark_Spaced-WHITE.png";

  // Expose header height as a CSS var so the page can offset content if needed
  useLayoutEffect(() => {
    if (headerRef.current) {
      const h = headerRef.current.offsetHeight;
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    }
  }, []);

  // Optional: apply top padding globally if you don't handle it elsewhere
  // useEffect(() => {
  //   const root = document.documentElement;
  //   const prev = root.style.paddingTop;
  //   if (!prev) root.style.paddingTop = "var(--header-height)";
  //   return () => {
  //     root.style.paddingTop = prev;
  //   };
  // }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="site-header fixed top-0 left-0 right-0 z-300 w-full box-border
                   grid grid-cols-[auto_1fr_auto] items-center py-4 px-8
                   pointer-events-auto bg-black"
      >
        {/* Left: Logo (video on non-connect pages, static black on connect) */}
        <Link
          href="/"
          aria-label="Go to homepage"
          className="justify-self-start"
        >
          <video
            src="/assets/glassBSDF_transparent-320px.mp4"
            className="md:h-[3rem] h-[3rem] block"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
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
        <div className="fixed bottom-0 left-0 right-0 z-[299] md:hidden pb-2 px-2">
          <div
            className="px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]
                          "
          >
            <Button
              size="x-large"
              variant="accent"
              href="/connect"
              extraClass="w-full justify-center text-center text-lg shadow-lg shadow-white/30"
            >
              Connect +614 77 210 477
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
