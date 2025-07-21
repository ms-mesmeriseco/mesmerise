"use client";

import PropTypes from "prop-types";
import Image from "next/image";

export default function StaticTrustBadges({
  heading,
  logos = [],
  scroll = false,
}) {
  // Duplicate for scroll loop animation
  const duplicatedLogos = scroll ? [...logos, ...logos] : logos;

  return (
    <section className="w-full py-[var(--global-margin-md)] px-[var(--global-margin-xs)] overflow-hidden">
      <div className="flex gap-[var(--global-margin-md)] items-center">
        {/* Static heading block (15%) */}
        <div className="w-2/12 min-w-[120px]">
          {heading && (
            <h4 className="text-base md:text-xl font-medium">{heading}</h4>
          )}
        </div>

        {/* Logos area (85%) */}
        <div className="w-10/12 overflow-hidden">
          <div
            className={`flex items-center gap-[4rem] ${
              scroll
                ? "animate-scroll-horizontal whitespace-nowrap"
                : "flex-wrap"
            }`}
          >
            {duplicatedLogos.map((logo, idx) => (
              <div
                key={`logo-${idx}`}
                className="relative w-20 h-12 grayscale opacity-70 hover:opacity-100 transition duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt || ""}
                  fill
                  sizes="(max-width: 768px) 50px, 120px"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

StaticTrustBadges.propTypes = {
  heading: PropTypes.string,
  logos: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
    })
  ),
  scroll: PropTypes.bool,
};
