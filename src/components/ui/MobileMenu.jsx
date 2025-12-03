"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "./Button";

export default function MobileMenu({ items = [], pathname }) {
  const [open, setOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="relative md:hidden">
      {/* Hamburger button */}
      <button
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((prev) => !prev)}
        className="flex flex-col justify-center gap-[5px] p-4
                   rounded-full border border-[var(--mesm-grey-dk)]
                   bg-[var(--mesm-grey-xd)]/80 backdrop-blur-xs
                   hover:border-[var(--mesm-grey)] transition"
      >
        <span
          className={`h-[2px] w-5 rounded-full bg-[var(--mesm-l-grey)]
                      transition-transform duration-200
                      ${open ? "translate-y-[7px] rotate-45" : ""}`}
        />
        <span
          className={`h-[2px] w-5 rounded-full bg-[var(--mesm-l-grey)]
                      transition-opacity duration-150
                      ${open ? "opacity-0" : "opacity-100"}`}
        />
        <span
          className={`h-[2px] w-5 rounded-full bg-[var(--mesm-l-grey)]
                      transition-transform duration-200
                      ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <nav
          className="absolute right-0 mt-3 w-[220px]
                     rounded-2xl border border-[var(--mesm-grey-dk)]
                     bg-[var(--mesm-grey-xd)]/95
                     shadow-xl backdrop-blur-xs
                     p-2"
        >
          <ul className="flex flex-col">
            {items.map((item) => {
              const hasChildren =
                Array.isArray(item.children) && item.children.length > 0;

              const activeParent =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              const activeChild = hasChildren
                ? item.children.some(
                    (child) =>
                      pathname === child.href ||
                      pathname.startsWith(`${child.href}/`)
                  )
                : false;

              const active = activeParent || activeChild;

              return (
                <li key={item.href} className="no-list">
                  {/* Parent link (unchanged styling) */}
                  <Link
                    href={item.href}
                    className={[
                      "block px-2 py-2 text-sm",
                      "transition-colors ",
                      active
                        ? "text-[var(--mesm-l-grey)]"
                        : "text-[var(--mesm-l-grey)] hover:bg-[var(--mesm-grey-dk)]/70",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>

                  {/* Child links (if any) */}
                  {hasChildren && (
                    <ul className="flex flex-col">
                      {item.children.map((child) => {
                        const childActive =
                          pathname === child.href ||
                          pathname.startsWith(`${child.href}/`);

                        return (
                          <li key={child.href} className="no-list">
                            <Link
                              href={child.href}
                              className={[
                                // same base styles, with extra indent
                                "block px-2 py-2 text-sm pl-5",
                                "transition-colors ",
                                childActive
                                  ? "text-[var(--mesm-l-grey)]"
                                  : "text-[var(--mesm-l-grey)] hover:bg-[var(--mesm-grey-dk)]/70",
                              ].join(" ")}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <Button href="/connect" variant="CTA" size="large">
            Connect
          </Button>
        </nav>
      )}
    </div>
  );
}
