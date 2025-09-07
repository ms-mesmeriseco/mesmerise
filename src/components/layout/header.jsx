"use client";

import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";

function useHeaderGate() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [gateVisible, setGateVisible] = useState(!isHome);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (!isHome) {
      document.documentElement.setAttribute("data-header-visible", "true");
      setGateVisible(true);
      return;
    }

    const el = document.documentElement;
    const read = () => el.getAttribute("data-header-visible") === "true";
    setGateVisible(read());

    const mo = new MutationObserver(() => setGateVisible(read()));
    mo.observe(el, {
      attributes: true,
      attributeFilter: ["data-header-visible"],
    });
    return () => mo.disconnect();
  }, [isHome]);

  return gateVisible;
}

export default function Header() {
  const gateVisible = useHeaderGate();
  const [showWhileIdle, setShowWhileIdle] = useState(true);
  const timeoutRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (!gateVisible) return;
      setShowWhileIdle(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowWhileIdle(true), 300);
    };

    if (gateVisible)
      window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [gateVisible]);

  useLayoutEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      document.documentElement.style.setProperty(
        "--header-height",
        `${height}px`
      );
    }
  }, []);

  const isVisible = true;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          ref={headerRef}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "tween", duration: 0.2, delay: 0.1 }}
          className="site-header fixed z-50 w-full box-border 
                     grid grid-cols-[auto_1fr_auto] items-start py-4 px-8"
        >
          {/* Left: M logo (top-left) */}
          <a
            href="/"
            aria-label="Go to homepage"
            className="justify-self-start"
          >
            {/* <img className="w-[4rem]" src="/VerticalLockup.png" /> */}
            <svg
              className="w-[4rem] fill-[var(--foreground)]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 894.74 533.35"
            >
              <g>
                <path d="M879.88,0h-18.94c-12.8,0-24.49,7.29-30.12,18.79l-125.62,256.53c-5.44,11.1-8.26,23.3-8.26,35.67v207.6h0v14.78h197.81V14.86c0-8.21-6.65-14.86-14.86-14.86Z" />
                <path d="M747.17,0h-175.3c-13.14,0-25.13,7.46-30.94,19.24l-42.32,85.91h-.04l-210.92,428.13h23.38c.2,0,.37.08.57.08h175.96c.36,0,.71-.06,1.07-.08h20.25l9.18-18.63c.07-.14.17-.27.24-.42L760.82,21.95c4.98-10.12-2.38-21.95-13.66-21.95Z" />
                <path d="M459.48,0h-175.3c-13.14,0-25.13,7.46-30.94,19.25l-40.82,82.86h0L0,533.28h23.35c.2,0,.37.08.57.08h175.96c.36,0,.71-.06,1.07-.08h20.28l9.36-19.01L473.14,21.95c4.98-10.12-2.38-21.95-13.66-21.95Z" />
              </g>
            </svg>
          </a>

          {/* Middle: spacer */}
          <span />

          {/* Right: Connect button (top-right) */}
          <span className="justify-self-end">
            <Button
              size="small"
              variant="secondary"
              href="/connect"
              className="shadow-xl"
            >
              Connect
            </Button>
          </span>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
