"use client";

import Image from "next/image";
import { useMemo } from "react";

export default function AvatarRow({
  people = [],
  size = 48,
  scrollOnMobile = true,
  overlap = 0.28,
  reverse = false,
  tagline = "trusted by ambitious business owners",
}) {
  const sizesAttr = useMemo(
    () => "(max-width: 768px) 48px, (max-width: 1024px) 56px, 64px",
    []
  );

  const marginShift = Math.max(0, Math.min(1, overlap)) * size;

  return (
    <div className="w-fit flex items-center gap-4 flex-wrap">
      {/* AVATAR STACK */}
      <ul
        className={[
          "flex items-center",
          reverse ? "flex-row-reverse" : "flex-row",
          "justify-start",
          scrollOnMobile ? "overflow-x-auto md:overflow-visible" : "",
          scrollOnMobile
            ? "[-ms-overflow-style:none] [scrollbar-width:none]"
            : "",
          "py-1 pl-0",
        ].join(" ")}
        style={{ WebkitOverflowScrolling: "touch" }}
        aria-label="Customer avatars"
      >
        {people.map((p, i) => {
          const Wrapper = p.href ? "a" : p.onClick ? "button" : "div";
          const isEdge = i === 0;
          const style = isEdge
            ? undefined
            : reverse
            ? { marginRight: `-${marginShift}px` }
            : { marginLeft: `-${marginShift}px` };

          const commonProps = {
            key: p.id ?? i,
            className:
              "group relative inline-flex rounded-full outline-none " +
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-black " +
              "transition-transform hover:translate-x-[1px] focus-visible:scale-[1.03]",
            ...(p.href
              ? {
                  href: p.href,
                  target: "_self",
                  "aria-label": p.label ?? p.alt,
                }
              : {}),
            ...(p.onClick
              ? {
                  onClick: p.onClick,
                  type: "button",
                  "aria-label": p.label ?? p.alt,
                }
              : {}),
            style,
          };

          const initials =
            !p.src && p.alt
              ? p.alt
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : null;

          return (
            <li
              key={p.id ?? i}
              className={[
                "no-list",
                `z-[${10 + i}]`,
                reverse ? `z-[${10 + (people.length - i)}]` : "",
              ].join(" ")}
            >
              <Wrapper {...commonProps}>
                <span
                  className="block rounded-full ring-1 ring-[var(--mesm-grey-dk)] hover:ring-white/80 bg-black/10"
                  style={{ width: size, height: size }}
                >
                  {p.src ? (
                    <Image
                      src={p.src}
                      alt={p.alt || "Customer avatar"}
                      width={size}
                      height={size}
                      sizes={sizesAttr}
                      className="rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span
                      className="flex h-full w-full items-center justify-center rounded-full bg-white/10 text-white/80 text-sm font-medium"
                      aria-hidden={!!initials}
                      title={p.alt}
                    >
                      {initials ?? "?"}
                    </span>
                  )}
                </span>

                {(p.href || p.onClick) && (
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full ring-0 group-hover:ring-2 group-focus:ring-2 ring-[var(--mesm-yellow)]/70 transition"
                    aria-hidden="true"
                  />
                )}
              </Wrapper>
            </li>
          );
        })}
      </ul>

      {/* TAGLINE */}
      {tagline && (
        <h6 className="text-sm text-left opacity-85 whitespace-wrap w-[160px]">
          {tagline}
        </h6>
      )}
    </div>
  );
}
