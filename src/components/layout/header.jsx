"use client";

import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";

function useHeaderGate() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [gateVisible, setGateVisible] = useState(!isHome); // show by default off-home

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (!isHome) {
      // Ensure other pages always show the header
      document.documentElement.setAttribute("data-header-visible", "true");
      setGateVisible(true);
      return;
    }

    // Home: follow the attribute controlled by the splash logic
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
    const [mounted, setMounted] = useState(false); // <-- add this
  useEffect(() => {
    setMounted(true);
  }, []);
  const gateVisible = useHeaderGate();
  const [showWhileIdle, setShowWhileIdle] = useState(true);
  const timeoutRef = useRef(null);
  const headerRef = useRef(null);

  // Keep your “hide on scroll, show after 300ms idle”, but only when gate is open
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (!gateVisible) return; // Only hide/show if header should be visible
      setShowWhileIdle(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowWhileIdle(true), 300);
    };

    if (gateVisible) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

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

  const isVisible = gateVisible && showWhileIdle;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          ref={headerRef}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "tween", duration: 0.2, delay: 0.1 }}
          className="site-header fixed z-50 w-full box-border bg-[var(--background)] 
          grid grid-cols-3 items-center  p-[var(--global-margin-lg)]"
        >
          <span>
            <a href="../">
              <svg
                id="Layer_2"
                data-name="Layer 2"
                className="h-[2rem] fill-[var(--foreground)]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 894.74 533.35"
              >
                <g id="Layer_1-2" data-name="Layer 1">
                  <g>
                    <path
                      className="cls-1"
                      d="M879.88,0h-18.94c-12.8,0-24.49,7.29-30.12,18.79l-125.62,256.53c-5.44,11.1-8.26,23.3-8.26,35.67v207.6h0v14.78h197.81V14.86c0-8.21-6.65-14.86-14.86-14.86Z"
                    />
                    <path
                      className="cls-1"
                      d="M747.17,0h-175.3c-13.14,0-25.13,7.46-30.94,19.24l-42.32,85.91h-.04l-210.92,428.13h23.38c.2,0,.37.08.57.08h175.96c.36,0,.71-.06,1.07-.08h20.25l9.18-18.63c.07-.14.17-.27.24-.42L760.82,21.95c4.98-10.12-2.38-21.95-13.66-21.95Z"
                    />
                    <path
                      className="cls-1"
                      d="M459.48,0h-175.3c-13.14,0-25.13,7.46-30.94,19.25l-40.82,82.86h0L0,533.28h23.35c.2,0,.37.08.57.08h175.96c.36,0,.71-.06,1.07-.08h20.28l9.36-19.01s.01-.02.02-.04L473.14,21.95c4.98-10.12-2.38-21.95-13.66-21.95Z"
                    />
                  </g>
                </g>
              </svg>
            </a>
          </span>

          <span className="flex justify-center header-nav">
            <a
              href="/about"
              className="text-[var(--foreground)] text-[var(--font-size)] ml-4"
            >
              About
            </a>
            <a
              href="/services"
              className="text-[var(--foreground)] text-[var(--font-size)] ml-4"
            >
              Services
            </a>
            <a
              href="/work"
              className="text-[var(--foreground)] text-[var(--font-size)] ml-4"
            >
              Work
            </a>
          </span>

          <span className="flex gap-2 justify-end">
            <PrimaryButton key="button" href="/connect">
              Connect
            </PrimaryButton>
            <SecondaryButton key="button2" href="/connect">
              Learn more
            </SecondaryButton>
          </span>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
