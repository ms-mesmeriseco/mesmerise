"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { sanityClient } from "@/sanity/client";
import InView from "@/hooks/InView";
import SmallTitle from "@/components/ui/SmallTitle";
import VideoCard from "../ui/VideoCard";
import { PortableText } from "@portabletext/react";
import RailCursor from "@/components/ui/RailCursor";

const railQuery = `
  *[_type == "testimonialsRail" && title == "Homepage Testimonials"][0] {
    _id,
    title,
    items[]-> {
      _id,
      _type,
      quoteContent,
      authorName,
      authorTitle,
      authorCompany,
      "authorPhotoUrl": authorPhoto.asset->url,
      "clientLogoUrl": clientLogo.asset->url,
      mediaType,
      caption,
      "imageUrl": image.asset->url,
      "videoUrl": video.asset->url,
    }
  }
`;

const SHORT_QUOTE_THRESHOLD = 130;
const SCROLL_AMOUNT = 460;

function Card({
  authorName,
  authorTitle,
  authorCompany,
  authorPhotoUrl,
  clientLogoUrl,
  quoteContent,
}) {
  const isShort = quoteContent?.length <= SHORT_QUOTE_THRESHOLD;

  return (
    <div className="my-1 shrink-0 w-[340px] md:w-[420px] h-fit duration-200 border border-[var(--foreground)]/20 rounded-lg p-7 flex flex-col justify-between gap-6 select-none">
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
        <span className="text-[var(--foreground)] text-2xl leading-snug testimonial-text">
          <PortableText value={quoteContent} />
        </span>
      ) : (
        <PortableText value={quoteContent} />
      )}
      {authorName && (
        <div className="flex items-center gap-3">
          {authorPhotoUrl && (
            <div className="shrink-0 w-13 rounded-full overflow-hidden border border-[var(--foreground)]/30">
              <Image
                src={authorPhotoUrl}
                alt={authorName}
                width={56}
                height={56}
                className="object-cover w-full h-full pointer-events-none"
              />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-[var(--foreground)] text-sm font-medium">
              {authorName}
            </span>
            {authorTitle && (
              <span className="text-[var(--foreground)]/60 text-xs">
                {authorTitle}
              </span>
            )}
            {authorCompany && (
              <span className="text-[var(--foreground)]/60 text-xs uppercase tracking-wide">
                {authorCompany}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MediaCard({
  mediaType,
  imageUrl,
  imageWidth,
  imageHeight,
  videoUrl,
  caption,
}) {
  const maxWidth = imageHeight > imageWidth ? "max-w-[600px]" : "max-w-[400px]";

  return (
    <div
      className={`my-1 shrink-0 ${maxWidth} h-fit rounded-lg overflow-hidden select-none relative`}
    >
      {mediaType === "image" && imageUrl && (
        <div style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}>
          <Image
            src={imageUrl}
            alt={caption || ""}
            width={800}
            height={0}
            className="object-cover pointer-events-none w-full h-full"
          />
        </div>
      )}
      {mediaType === "video" && videoUrl && <VideoCard videoUrl={videoUrl} />}
    </div>
  );
}

export default function TestimonialsRail({ innerRef }) {
  const [items, setItems] = useState([]);
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
        const data = await sanityClient.fetch(railQuery);
        setItems(data?.items || []);
      } catch (err) {
        console.error("Failed to fetch testimonials rail:", err);
      }
    }
    fetchData();
  }, []);

  const scrollBy = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    cancelAnimationFrame(drag.current.raf);
    const start = rail.scrollLeft;
    const target = start + direction * SCROLL_AMOUNT;
    const distance = target - start;
    const duration = 420;
    let startTime = null;

    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      rail.scrollLeft = start + distance * easeInOut(progress);
      if (progress < 1) drag.current.raf = requestAnimationFrame(step);
    };

    drag.current.raf = requestAnimationFrame(step);
  };

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
    rail.style.cursor = "none";
  };

  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    const rail = railRef.current;
    if (!rail) return;
    rail.style.cursor = "none";
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
    rail.style.cursor = "none";
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

  // Distinguish a click from a drag — only fire scrollBy if the mouse barely moved
  const onMouseUpWithClick = (e, direction) => {
    const didDrag = Math.abs(drag.current.velX) > 2;
    onMouseUp();
    if (!didDrag) scrollBy(direction);
  };

  if (!items.length) return null;

  return (
    <section className="relative overflow-hidden hide-cursor">
      <InView>
        <div className="flex flex-col items-center">
          <div className="w-full my-auto">
            <SmallTitle>What our clients say</SmallTitle>
            <RailCursor className="mt-0 overflow-hidden">
              <div
                ref={railRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={(e) => {
                  const rail = railRef.current;
                  if (!rail) return onMouseUp();

                  // Don't scroll if releasing over video controls
                  if (e.target.closest("#hide-cursor")) return onMouseUp();

                  const rect = rail.getBoundingClientRect();
                  const relX = e.clientX - rect.left;
                  const third = rect.width / 3;
                  if (relX < third) {
                    onMouseUpWithClick(e, -2);
                  } else if (relX > rect.width - third) {
                    onMouseUpWithClick(e, 2);
                  } else {
                    onMouseUp();
                  }
                }}
                onMouseLeave={onMouseUp}
                style={{ cursor: "none" }}
                className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide"
              >
                {items.map((item) =>
                  item._type === "mediaBlock" ? (
                    <MediaCard key={item._id} {...item} />
                  ) : (
                    <Card key={item._id} {...item} />
                  ),
                )}
                <div className="shrink-0 w-4" />
              </div>
            </RailCursor>
          </div>
        </div>
      </InView>
    </section>
  );
}
