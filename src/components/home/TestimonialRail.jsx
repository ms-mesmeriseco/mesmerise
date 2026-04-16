"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { sanityClient } from "@/sanity/client";
import InView from "@/hooks/InView";
import SmallTitle from "@/components/ui/SmallTitle";

const testimonialsQuery = `
  *[_type == "testimonial"] | order(coalesce(order, 9999) asc)  {
    _id,
    quote,
    authorName,
    authorTitle,
    authorCompany,
    "authorPhotoUrl": authorPhoto.asset->url,
    "clientLogoUrl": clientLogo.asset->url,

  }
`;

const SHORT_QUOTE_THRESHOLD = 130;

function Card({
  quote,
  authorName,
  authorTitle,
  authorCompany,
  authorPhotoUrl,
  clientLogoUrl,
}) {
  const isShort = quote?.length <= SHORT_QUOTE_THRESHOLD;

  return (
    <div className="hover:scale-102 my-1 shrink-0 w-[340px] md:w-[420px] hover:bg-[var(--foreground)]/10 duration-200 border border-white/20 rounded-lg p-7 flex flex-col justify-between gap-6 select-none">
      {clientLogoUrl && (
        <div className="h-10 flex items-start">
          <Image
            src={clientLogoUrl}
            alt={authorCompany || ""}
            width={120}
            height={40}
            className="object-contain max-h-10 w-auto brightness-0 invert pointer-events-none"
          />
        </div>
      )}

      {isShort ? (
        <span className="text-white text-2xl leading-snug">{quote}</span>
      ) : (
        <p className="text-white leading-snug">{quote}</p>
      )}

      {authorName && (
        <div className="flex items-center gap-3">
          {authorPhotoUrl && (
            <div className="shrink-0 w-11 h-11 rounded-full overflow-hidden border border-white/30">
              <Image
                src={authorPhotoUrl}
                alt={authorName}
                width={44}
                height={44}
                className="object-cover w-full h-full pointer-events-none"
              />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">{authorName}</span>
            {authorTitle && (
              <span className="text-white/60 text-xs">{authorTitle}</span>
            )}
            {authorCompany && (
              <span className="text-white/60 text-xs uppercase tracking-wide">
                {authorCompany}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TestimonialsRail({ innerRef }) {
  const [testimonials, setTestimonials] = useState([]);
  const railRef = useRef(null);
  const drag = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    velX: 0,
    lastX: 0,
    raf: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await sanityClient.fetch(testimonialsQuery);
        setTestimonials(data || []);
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      }
    }
    fetchData();
  }, []);

  const onMouseDown = (e) => {
    const rail = railRef.current;
    if (!rail) return;
    cancelAnimationFrame(drag.current.raf);
    drag.current = {
      active: true,
      startX: e.pageX - rail.offsetLeft,
      scrollLeft: rail.scrollLeft,
      velX: 0,
      lastX: e.pageX,
      raf: null,
    };
    rail.style.cursor = "grabbing";
  };

  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    const rail = railRef.current;
    if (!rail) return;
    e.preventDefault();
    const x = e.pageX - rail.offsetLeft;
    const walk = x - drag.current.startX;
    drag.current.velX = e.pageX - drag.current.lastX;
    drag.current.lastX = e.pageX;
    rail.scrollLeft = drag.current.scrollLeft - walk;
  };

  const onMouseUp = () => {
    const rail = railRef.current;
    if (!rail) return;
    drag.current.active = false;
    rail.style.cursor = "grab";

    let velocity = -drag.current.velX * 1.2;
    const glide = () => {
      if (!railRef.current) return;
      velocity *= 0.92;
      if (Math.abs(velocity) < 0.5) return;
      railRef.current.scrollLeft += velocity;
      drag.current.raf = requestAnimationFrame(glide);
    };
    drag.current.raf = requestAnimationFrame(glide);
  };

  if (!testimonials.length) return null;

  return (
    <section className="relative overflow-hidden">
      <InView>
        <SmallTitle>What our clients say</SmallTitle>
        <div
          ref={railRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          className="mt-4 flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory cursor-grab"
        >
          {testimonials.map((t) => (
            <div key={t._id} className="snap-start">
              <Card {...t} />
            </div>
          ))}
          <div className="shrink-0 w-4" />
        </div>
      </InView>
    </section>
  );
}
