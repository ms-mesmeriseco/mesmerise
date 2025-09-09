"use client";

import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";

export default function TrustBadges({ logos = [], scroll = true }) {
  const duplicatedLogos = scroll ? [...logos, ...logos] : logos;

  return (
    <section className="w-full py-8 overflow-hidden h-full">
      <div className="flex gap-8 items-center">
        {/* Logo area (85%) */}
        <div className={"w-12/12 overflow-hidden relative"}>
          {/* Left Gradient Overlay */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-36 z-10 bg-gradient-to-r from-black to-transparent" />

          {/* Right Gradient Overlay */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-36 z-10 bg-gradient-to-l from-black to-transparent" />

          <div
            className={`flex items-center gap-50 ${
              scroll
                ? "animate-scroll-horizontal whitespace-nowrap"
                : "flex-wrap"
            }`}
          >
            {duplicatedLogos.map((logo, idx) => (
              <Link
                key={`logo-${idx}`}
                href={logo.description}
                className="contents"
                target="_blank"
              >
                <Image
                  src={logo.url}
                  alt={logo.title || ""}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

TrustBadges.propTypes = {
  textContent: PropTypes.shape({
    json: PropTypes.object,
  }),
  logos: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string,
    })
  ),
  scroll: PropTypes.bool,
};
