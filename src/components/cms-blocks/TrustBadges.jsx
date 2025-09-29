"use client";

import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";

export default function TrustBadges({
  logos = [],
  scroll = true,
  duration = 18,
}) {
  // Two identical reels -> seamless loop
  const reel = [...logos, ...logos];

  return (
    <section className="w-full py-8 overflow-hidden">
      <div className="relative w-full">
        {/* Edge fade (optional) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-black to-transparent" />

        <div
          className={[
            "flex items-center whitespace-nowrap",
            scroll ? "animate-marquee marquee-will-change transform-gpu" : "",
          ].join(" ")}
          style={{ ["--marquee-duration"]: `${duration}s` }}
        >
          {/* Reel A */}
          <Reel logos={logos} />
          {/* Reel B (duplicate, aria-hidden for a11y) */}
          <Reel logos={logos} ariaHidden />
        </div>
      </div>
    </section>
  );
}

function Reel({ logos, ariaHidden = false }) {
  return (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex items-center flex-none gap-32 px-16"
    >
      {logos.map((logo, i) => {
        const href = logo.href || logo.description || "#";
        return (
          <li key={`${logo.url}-${i}`} className=" flex-none no-list">
            <Link href={href} target="_blank" className="block">
              <Image
                src={logo.url}
                alt={logo.title || ""}
                width={128}
                height={64}
                className="object-contain w-[109px] h-[64px]"
                // Remove layout shifts during scroll
                priority={false}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

TrustBadges.propTypes = {
  logos: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string,
      href: PropTypes.string, // or use description as a fallback
      description: PropTypes.string,
    })
  ),
  scroll: PropTypes.bool,
  duration: PropTypes.number, // seconds
};
