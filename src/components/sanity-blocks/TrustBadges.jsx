"use client";

import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export default function TrustBadges({
  logos = [],
  scroll = true,
  // speeds
  durationDesktop = 32,
  durationMobile = 18, // slower on mobile by default (change to taste)
  // spacing
  gapPx = 128, // Tailwind gap-32 ≈ 128px
  padPx = 64, // Tailwind px-16 ≈ 64px
}) {
  const trackRef = useRef(null);
  const reelARef = useRef(null);
  const [reelWidth, setReelWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Measure Reel A width exactly (accounts for gaps & logo sizes)
  useEffect(() => {
    if (!reelARef.current) return;

    const measure = () => {
      const w = reelARef.current.getBoundingClientRect().width;
      setReelWidth(Math.round(w));
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(reelARef.current);
    return () => ro.disconnect();
  }, [logos]);

  // Track mobile/desktop for speed switching
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  const chosenDuration = isMobile ? durationMobile : durationDesktop;

  // Inline CSS vars
  const styleVars = {
    // translate exactly one full reel + the seam gap
    ["--marquee-distance"]: reelWidth ? `${reelWidth + gapPx}px` : "50%",
    ["--marquee-duration"]: `${chosenDuration}s`,
    ["--marquee-pad"]: `${padPx}px`,
  };

  return (
    <section className="w-full py-8 overflow-hidden">
      <div className="relative w-full">
        {/* Edge fade (optional) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-black to-transparent" />

        {/* Moving track */}
        <div
          ref={trackRef}
          className={[
            "flex items-center whitespace-nowrap flex-nowrap transform-gpu",
            "px-[var(--marquee-pad)]",
            scroll ? "marquee-animate" : "",
          ].join(" ")}
          style={styleVars}
        >
          {/* Reel A */}
          <Reel ref={reelARef} logos={logos} gapPx={gapPx} />
          {/* Reel B with a seam gap */}
          <Reel
            logos={logos}
            gapPx={gapPx}
            ariaHidden
            style={{ marginLeft: `${gapPx}px` }}
          />
        </div>
      </div>
    </section>
  );
}

const Reel = React.forwardRef(function Reel(
  { logos, ariaHidden = false, gapPx = 128, style },
  ref
) {
  return (
    <ul
      ref={ref}
      aria-hidden={ariaHidden || undefined}
      className="flex items-center flex-none"
      style={{ columnGap: `${gapPx}px`, ...(style || {}) }}
    >
      {logos.map((logo, i) => {
        const href = logo.href || logo.description || "#";
        return (
          <li key={`${logo.url}-${i}`} className="flex-none no-list">
            <Link href={href} target="_blank" className="block">
              <Image
                src={logo.url}
                alt={logo.title || ""}
                width={128}
                height={64}
                className="object-contain w-[96px] h-[64px]"
                priority={false}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
});

TrustBadges.propTypes = {
  logos: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string,
      href: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  scroll: PropTypes.bool,
  durationDesktop: PropTypes.number,
  durationMobile: PropTypes.number,
  gapPx: PropTypes.number,
  padPx: PropTypes.number,
};
