"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import HeroButton from "../ui/HeroButton";
import MobileMenu from "../ui/MobileMenu";

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
    (c) => pathname === c.href || pathname.startsWith(`${c.href}/`),
  );
  return direct || childHit;
}

function DesktopNav({ pathname }) {
  const [openLabel, setOpenLabel] = useState(null);

  return (
    <nav className="hidden md:flex">
      <div className="flex items-center gap-1 rounded-2xl p-1 border border-[var(--mesm-grey-dk)]/60 backdrop-blur-sm text-lg">
        {NAV_ITEMS.map((item) => {
          const active = isItemActive(item, pathname);
          const hasChildren = !!item.children?.length;
          const isOpen = openLabel === item.label;

          return (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => hasChildren && setOpenLabel(item.label)}
              onMouseLeave={() => hasChildren && setOpenLabel(null)}
            >
              <Link
                href={item.href}
                className={[
                  "px-3 py-1.5 rounded-xl transition-colors duration-150 inline-flex items-center",
                  "border border-transparent hover:border-[var(--mesm-grey)]/40",
                  active
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "text-[var(--foreground)]",
                ].join(" ")}
              >
                {item.label}
              </Link>

              {hasChildren && (
                <div
                  className={[
                    "absolute left-0 top-full pt-2 min-w-[200px] z-[400]",
                    "transition-all duration-150 origin-top-left",
                    isOpen
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none",
                  ].join(" ")}
                >
                  <div className="flex flex-col gap-1">
                    {item.children.map((child) => {
                      const childActive =
                        pathname === child.href ||
                        pathname.startsWith(`${child.href}/`);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={[
                            "block px-3 py-2 text-sm rounded-xl transition-colors duration-150 w-fit",
                            "bg-[var(--foreground)] text-[var(--background)] shadow-md",
                            childActive
                              ? "opacity-50"
                              : "hover:bg-[var(--mesm-yellow)]",
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
    </nav>
  );
}

export default function Header() {
  const pathname = usePathname() || "/";
  const headerRef = useRef(null);
  const [showPromo, setShowPromo] = useState(true);
  const [scrolledEnough, setScrolledEnough] = useState(false);

  const KNOWN_PREFIXES = [
    "/",
    "/about",
    "/connect",
    "/services",
    "/collaboration",
    "/work",
    "/blog",
  ];
  const isLanding = !KNOWN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  // Single scroll listener for both needs
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setShowPromo(y < 40);
      setScrolledEnough(y >= window.innerHeight);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Store header height in CSS var
  useEffect(() => {
    if (headerRef.current) {
      document.documentElement.style.setProperty(
        "--header-height",
        `${headerRef.current.offsetHeight}px`,
      );
    }
  }, []);

  return (
    <>
      {/* Promo banner */}
      <div
        className={[
          "fixed top-0 left-0 right-0 z-[301] transition-all duration-300",
          showPromo
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-full pointer-events-none",
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-[var(--global-margin-xs)] py-2">
          <Link
            href="/cro-audit"
            className="flex items-center justify-center gap-3 rounded-xl md:rounded-2xl px-1 py-2
                       bg-[var(--accent2)] text-[var(--background)] text-xs md:text-sm
                       hover:bg-[var(--accent2-l)] transition-colors duration-200"
          >
            <span>
              Feel like you're burning money and not seeing a return on ad
              spend?
            </span>
            <span className="hidden md:inline underline">
              You could benefit from a CRO Audit
            </span>
          </Link>
        </div>
      </div>

      {/* Header */}
      <header
        ref={headerRef}
        style={{ top: showPromo ? "48px" : "0px" }}
        className="fixed left-0 right-0 z-300 flex items-center justify-between gap-2
                   pt-[var(--global-margin-xs)] px-[var(--global-margin-sm)]
                   transition-[top] duration-300 ease-out pointer-events-auto"
      >
        {/* Logo — single element, breakpoint swaps via CSS */}
        <Link href="/" aria-label="Go to homepage">
          <img
            src="/WordMark_Spaced.png"
            alt="Mesmerise Digital"
            className="h-12 w-auto rounded-2xl px-4 py-3
                       bg-[var(--mesm-grey-dk)]/5 border border-[var(--mesm-grey-dk)]/60
                       hover:border-[var(--mesm-grey)]/60 backdrop-blur-sm
                       transition-colors duration-250"
          />
        </Link>

        {/* Desktop nav — hidden below 1035px */}
        <div className="hidden [@media(min-width:1035px)]:block">
          <DesktopNav pathname={pathname} />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden [@media(min-width:1035px)]:block">
            <HeroButton href="/connect">Let's connect</HeroButton>
          </div>
          <div className="block [@media(min-width:1035px)]:hidden">
            <MobileMenu items={MOB_NAV_ITEMS} pathname={pathname} />
          </div>
        </div>
      </header>

      {/* Mobile sticky CTA — landing pages only */}
      {isLanding && scrolledEnough && (
        <div className="fixed bottom-0 left-0 right-0 z-[299] md:hidden px-10 pb-6">
          <div className="px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
            <HeroButton size="x-large" variant="CTA" href="tel:+61477210477">
              <span className="text-2xl">Speak to Simba</span>
            </HeroButton>
          </div>
        </div>
      )}
    </>
  );
}
