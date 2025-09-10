"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "../ui/Button";

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef(null);

  // Logo colour: black on /connect, white elsewhere
  const isContact = pathname === "/connect";
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

  // (Optional) ensure the document has a top-padding using the var
  // If you already handle this elsewhere, remove this block.
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
      className="site-header fixed top-0 left-0 right-0 z-300 w-full box-border
                 grid grid-cols-[auto_1fr_auto] items-center py-4 px-8
                 pointer-events-auto"
    >
      {/* Left: Logo */}
      <Link href="/" aria-label="Go to homepage" className="justify-self-start">
        {/* <img className="w-4/12 block" src={logo} alt="Mesmerise Logo" /> */}
        <svg
          className="w-3/12 fill-[var(--foreground)]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 894.74 533.35"
        >
          <g>
            <path d="M879.88,0h-18.94c-12.8,0-24.49,7.29-30.12,18.79l-125.62,256.53c-5.44,11.1-8.26,23.3-8.26,35.67v207.6h0v14.78h197.81V14.86c0-8.21-6.65-14.86-14.86-14.86Z" />
            <path d="M747.17,0h-175.3c-13.14,0-25.13,7.46-30.94,19.24l-42.32,85.91h-.04l-210.92,428.13h23.38c.2,0,.37.08.57.08h175.96c.36,0,.71-.06,1.07-.08h20.25l9.18-18.63c.07-.14.17-.27.24-.42L760.82,21.95c4.98-10.12-2.38-21.95-13.66-21.95Z" />
            <path d="M459.48,0h-175.3c-13.14,0-25.13,7.46-30.94,19.25l-40.82,82.86h0L0,533.28h23.35c.2,0,.37.08.57.08h175.96c.36,0,.71-.06,1.07-.08h20.28l9.36-19.01L473.14,21.95c4.98-10.12-2.38-21.95-13.66-21.95Z" />
          </g>
        </svg>
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
