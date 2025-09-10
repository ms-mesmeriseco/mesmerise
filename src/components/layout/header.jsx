"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "../ui/Button";

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const [sceneInView, setSceneInView] = useState(false);

  const isConnect = pathname === "/connect";
  const blackLogo = "/WordMark_Spaced-BLACK.png";

  // Observe the home scene
  useEffect(() => {
    if (typeof window === "undefined") return;

    const el = document.querySelector("#home-scene");
    if (!el) {
      // On non-home pages (or if the section isn't mounted), show the video
      setSceneInView(false);
      return;
    }

    // Account for fixed header height so intersection is correct
    const raw = getComputedStyle(document.documentElement).getPropertyValue(
      "--header-height"
    );
    const headerH = parseInt(raw) || 0;

    const io = new IntersectionObserver(
      ([entry]) => {
        // Any overlap hides the video (use threshold: [1] to hide only when fully visible)
        setSceneInView(entry.isIntersecting && entry.intersectionRatio > 0);
      },
      { root: null, rootMargin: `-${headerH}px 0px 0px 0px`, threshold: [0] }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  // Keep --header-height up to date
  useLayoutEffect(() => {
    if (headerRef.current) {
      document.documentElement.style.setProperty(
        "--header-height",
        `${headerRef.current.offsetHeight}px`
      );
    }
  }, []);

  // (Optional) global top padding if you rely on it
  // useEffect(() => {
  //   const root = document.documentElement;
  //   const prev = root.style.paddingTop;
  //   if (!prev) root.style.paddingTop = "var(--header-height)";
  //   return () => {
  //     root.style.paddingTop = prev;
  //   };
  // }, []);

  return (
    <header
      ref={headerRef}
      className="site-header h-[5rem] fixed top-0 left-0 right-0 z-300 w-full box-border
                 grid grid-cols-[auto_1fr_auto] items-center py-4 px-8 bg-black"
    >
      <Link href="/" aria-label="Go to homepage" className="justify-self-start">
        <video
          src="/assets/glassBSDF_transparent-320px.mp4"
          className={[
            "w-[6rem] block transition-opacity duration-500",
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

      <span />

      <span className="justify-self-end">
        {!isConnect && (
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
