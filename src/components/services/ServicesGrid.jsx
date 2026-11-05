"use client";

import { useRef } from "react";
import Link from "next/link";

const VIDEO_DIR = "/assets/services-videos";

const DEFAULT_SERVICES = [
  {
    title: "Strategy",
    blurb: "A successful business starts with clarity",
    href: "/services/strategy",
    video: `${VIDEO_DIR}/Strategy.mp4`,
    accent: "var(--mesm-yellow)",
  },
  {
    title: "Branding",
    blurb: "Build trust in the blink of an eye",
    href: "/services/branding",
    video: `${VIDEO_DIR}/Branding.mp4`,
    accent: "var(--accent)",
  },
  {
    title: "Website",
    blurb: "We build expressive websites that engage and convert",
    href: "/services/website",
    video: `${VIDEO_DIR}/Website.mp4`,
    accent: "var(--mesm-blue)",
  },
  {
    title: "Performance & Growth",
    blurb: "Attention is fleeting, trust is not",
    href: "/services/performance-growth",
    video: `${VIDEO_DIR}/Growth.mp4`,
    accent: "var(--mesm-red)",
  },
  {
    title: "Analytics",
    blurb: "When you understand the data, decision-making becomes simple",
    href: "/services/analytics",
    video: `${VIDEO_DIR}/Analytics.mp4`,
    accent: "var(--accent2)",
  },
];

// Gap between the cursor and the floating title, in px
const CURSOR_OFFSET = 16;

function ServiceCard({ title, href, video }) {
  const videoRef = useRef(null);
  const labelRef = useRef(null);

  const play = () => {
    // play() returns a promise that rejects if interrupted by pause(); ignore it
    videoRef.current?.play().catch(() => {});
  };
  const pause = () => videoRef.current?.pause();

  // Move the floating title with the cursor directly, without re-rendering
  const follow = (e) => {
    const label = labelRef.current;
    if (!label) return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - box.left + CURSOR_OFFSET;
    const y = e.clientY - box.top + CURSOR_OFFSET;
    label.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  return (
    <li
      // Flex (not grid) so items on an incomplete last row grow to fill it.
      // Basis = (100% - total gap) / cols, with gap-2 = 0.5rem.
      className="no-list group relative grow basis-full md:basis-[calc((100%-1rem)/3)]"
      onMouseEnter={(e) => {
        follow(e);
        play();
      }}
      onMouseMove={follow}
      onMouseLeave={pause}
    >
      <Link
        href={href}
        onFocus={play}
        onBlur={pause}
        // Height = one column's width (100cqw is the list's width), so cards
        // that grow on a short last row stay the same height as the rest
        className="relative block overflow-hidden rounded-lg border border-[var(--mesm-grey-dk)]
                   aspect-square md:aspect-auto md:h-[calc((100cqw-1rem)/3)]
                   focus:outline-none"
        aria-label={`Learn more about ${title}`}
      >
        <video
          ref={videoRef}
          // #t=0.001 makes Safari/iOS render the first frame as a poster
          src={`${video}#t=0.001`}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-contain p-6"
        />

        {/* Mobile: title fixed in the top left */}
        <h5 className="relative p-3 md:hidden">{title}</h5>
      </Link>

      {/* Desktop: title follows the cursor while hovering. Sits outside the
          link so the card's overflow-hidden doesn't clip it at the edges */}
      <span
        ref={labelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block whitespace-nowrap
                   opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        <h3>{title}</h3>
      </span>
    </li>
  );
}

export default function ServicesGrid({
  heading = "What we do",
  services = DEFAULT_SERVICES,
}) {
  return (
    <section className="w-full relative">
      {heading && <h6 className="mb-2 opacity-80">{heading}</h6>}

      <ul className="@container flex flex-wrap gap-2 py-2 border-t border-b border-[var(--mesm-grey-dk)]">
        {services.map((svc) => (
          <ServiceCard key={svc.href || svc.title} {...svc} />
        ))}
      </ul>
    </section>
  );
}
