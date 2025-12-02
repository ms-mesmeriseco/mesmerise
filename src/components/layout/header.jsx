"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "../ui/Button";
import MobileMenu from "../ui/MobileMenu";

// --- NAV ITEMS (with children for Services + Collaborate) ---
export const NAV_ITEMS = [
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Strategy", href: "/services/strategy" },
      { label: "Branding", href: "/services/branding" },
      { label: "Website", href: "/services/website" },
      { label: "Performance & Growth", href: "/services/performance-growth" },
      { label: "Analytics", href: "/services/analytics" },
    ],
  },

  { label: "Work", href: "/work" },

  {
    label: "Collaboration",
    href: "/collaboration",
    children: [
      { label: "Defined", href: "/collaboration/defined" },
      { label: "Continuous", href: "/collaboration/continuous" },
    ],
  },
  { label: "About", href: "/about" },
];
export const MOB_NAV_ITEMS = [
  { label: "About", href: "/about" },

  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Strategy", href: "/services/strategy" },
      { label: "Branding", href: "/services/branding" },
      { label: "Website", href: "/services/website" },
      { label: "Performance & Growth", href: "/services/performance-growth" },
      { label: "Analytics", href: "/services/analytics" },
    ],
  },

  { label: "Work", href: "/work" },

  {
    label: "Collaborate",
    href: "/collaboration",
    children: [
      { label: "Defined", href: "/collaboration/defined" },
      { label: "Continuous", href: "/collaboration/continuous" },
    ],
  },
];
function isItemActive(item, pathname) {
  const direct = pathname === item.href || pathname.startsWith(`${item.href}/`);

  const childHit = item.children?.some(
    (child) => pathname === child.href || pathname.startsWith(`${child.href}/`)
  );

  return direct || childHit;
}

// --- Desktop nav that mimics ToggleSwitch styling ---
function DesktopNav({ pathname }) {
  const [openLabel, setOpenLabel] = useState(null);

  const selectedBg = "var(--foreground)"; // same as you used in MenuToggle
  const selectedTextClass = "text-black";
  const textSizeClass = "text-lg"; // matches textSize="lg"

  return (
    <div className="hidden md:flex">
      <div
        className={[
          "flex items-center gap-2",
          "bg-[var(--mesm-grey-dk)]/5",
          "rounded-2xl p-1",
          "border border-[var(--mesm-grey-dk)]",
          "w-fit mx-auto",
          "shadow-xl backdrop-blur-xs",
          textSizeClass,
        ].join(" ")}
      >
        {NAV_ITEMS.map((item) => {
          const active = isItemActive(item, pathname);
          const hasChildren =
            Array.isArray(item.children) && item.children.length > 0;
          const isOpen = openLabel === item.label;

          return (
            <div
              key={item.label}
              className="relative flex-1"
              onMouseEnter={() => hasChildren && setOpenLabel(item.label)}
              onMouseLeave={() =>
                hasChildren &&
                setOpenLabel((prev) => (prev === item.label ? null : prev))
              }
            >
              {/* Top-level button styled like ToggleSwitch */}
              <Link
                href={item.href}
                className={[
                  "flex-1 px-3 py-1 rounded-xl transition-colors cursor-pointer",
                  "focus:outline-none border-1 border-transparent hover:border-[var(--mesm-grey)]",
                  "inline-flex items-center justify-center w-full",
                  active ? selectedTextClass : "text-[var(--foreground)]",
                ].join(" ")}
                style={active ? { backgroundColor: selectedBg } : undefined}
              >
                {item.label}
              </Link>

              {/* Dropdown children (only for Services / Collaborate) */}
              {hasChildren && isOpen && (
                <div
                  className="absolute left-0  top-full
               min-w-[220px] z-[400]"
                >
                  {/* Only margin & space — no bg, no border */}
                  <div className="mt-2 pt-1 flex flex-col gap-1">
                    {item.children.map((child) => {
                      const childActive =
                        pathname === child.href ||
                        pathname.startsWith(`${child.href}/`);

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={[
                            "block px-3 py-2 text-sm rounded-xl transition-colors w-fit",
                            "text-[var(--background)] bg-[var(--foreground)]",
                            childActive
                              ? "bg-[var(--mesm-l-grey)]/20 text-[var(--foreground)]/20 shadow-lg"
                              : "hover:bg-[var(--mesm-yellow)] hover:text-[var(--background)] shadow-md",
                          ].join(" ")}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname() || "/";
  const headerRef = useRef(null);
  const [hydrated, setHydrated] = useState(false);
  const [sceneInView, setSceneInView] = useState(false);
  const [scrolledEnough, setScrolledEnough] = useState(false);
  const [showPromo, setShowPromo] = useState(true);

  const starts = (p) => pathname === p || pathname.startsWith(`${p}/`);

  const KNOWN_PREFIXES = [
    "/",
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

  // measure scene
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

  // store header height in CSS variable
  useLayoutEffect(() => {
    if (headerRef.current) {
      const h = headerRef.current.offsetHeight;
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    }
  }, []);

  // track hero in view
  useEffect(() => {
    if (typeof window === "undefined") return;

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

  // promo banner visibility (hide after user scrolls)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      // hide once they scroll a bit (change 40 to taste)
      setShowPromo(y < 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // sticky CTA scroll trigger
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const trigger = window.innerHeight;
      setScrolledEnough(window.scrollY >= trigger);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* CRO Promo Banner */}
      <div
        className={[
          "fixed top-0 left-0 right-0 z-[301]",
          "transition-all duration-300 ease-out",

          showPromo
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-full pointer-events-none",
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-[var(--global-margin-sm)] py-2">
          <Link
            href="/cro-audit"
            className="flex items-center justify-center gap-3 rounded-2xl px-4 py-2 
                       bg-[var(--accent2)] text-[var(--background)] shadow-lg hover:bg-[var(--accent2-l)]  duration-200 transition-colors "
          >
            <span className="text-sm md:text-base">
              Feel like you're burning money and not seeing a return on ad
              spend?
            </span>

            <span className="hidden text-sm md:inline-flex items-center gap-1 underline">
              You could benefit from a CRO Audit
            </span>
          </Link>
        </div>
      </div>

      <header
        ref={headerRef}
        className="site-header fixed left-0 right-0 z-300
                   flex items-center md:justify-between justify-end gap-2
                   pt-[var(--global-margin-xs)] px-[var(--global-margin-sm)]
                   box-border pointer-events-auto bg-transparent
                   transition-all duration-300 ease-out"
        style={{
          // This must match the banner height (here: ~48px).
          // Adjust if you change the banner's padding/height.
          top: showPromo ? "48px" : "0px",
        }}
      >
        {/* Logo */}
        <Link
          href="https://www.mesmeriseco.com/"
          aria-label="Go to homepage"
          className="justify-self-start"
        >
          <div>
            <img
              src="/WordMark_Spaced.png"
              preload="auto"
              className={[
                "md:h-[1.5rem] h-[1.77rem] block transition-opacity duration-100",
                "flex items-center gap-2",
                "bg-[var(--mesm-grey-dk)]/5",
                "rounded-2xl px-4 py-3",
                "border border-[var(--mesm-grey-dk)] hover:border-[var(--mesm-grey)]",
                "shadow-xl backdrop-blur-xs",
                "min-h-[3rem] flex items-center",
              ].join(" ")}
            />
          </div>
        </Link>

        {/* Right side: desktop Toggle-style nav + mobile hamburger */}
        <div className="flex items-center gap-3">
          {/* Desktop: ToggleSwitch-styled nav with dropdowns */}
          <DesktopNav pathname={pathname} />

          {/* Mobile: hamburger + nested links (already styled) */}
          <MobileMenu items={MOB_NAV_ITEMS} pathname={pathname} />
        </div>
        <div className="hidden md:flex md:items-center md:gap-2">
          <Button
            size="large"
            variant="Primary"
            href="/marketing-strategy-session"
          >
            <span className="text-xl">Strategy Session</span>
          </Button>
          <Button size="large" variant="CTA" href="/connect">
            <span className="text-xl">Connect</span>
          </Button>
        </div>
      </header>

      {/* Mobile sticky CTA (landing pages only, after 100vh) */}
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
