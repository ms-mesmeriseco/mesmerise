"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { sanityClient } from "@/sanity/client";
import InView from "@/hooks/InView";
import SmallTitle from "@/components/ui/SmallTitle";
import VideoCard from "../ui/VideoCard";

const railQuery = `
  *[_type == "testimonialsRail" && title == "Homepage Testimonials"][0] {
    _id,
    title,
    items[]-> {
      _id,
      _type,
      quote,
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
    <div className="hover:scale-102 my-1 shrink-0 w-[340px] md:w-[420px] h-fit hover:bg-[var(--foreground)]/10 duration-200 border border-[var(--foreground)]/20 rounded-lg p-7 flex flex-col justify-between gap-6 select-none">
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
        <span className="text-[var(--foreground)] text-2xl leading-snug">
          {quote}
        </span>
      ) : (
        <p className="text-[var(--foreground)] leading-snug">{quote}</p>
      )}
      {authorName && (
        <div className="flex items-center gap-3">
          {authorPhotoUrl && (
            <div className="shrink-0 w-11  rounded-full overflow-hidden border border-[var(--foreground)]/30">
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
  const maxWidth = imageHeight > imageWidth ? "max-w-[275px]" : "max-w-[400px]";

  return (
    <div
      className={`my-1 shrink-0 ${maxWidth} h-fit rounded-lg overflow-hidden border border-[var(--foreground)]/20 select-none relative`}
    >
      {mediaType === "image" && imageUrl && (
        <div style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}>
          <Image
            src={imageUrl}
            alt={caption || ""}
            width={275}
            height={0}
            className="object-cover pointer-events-none"
          />
        </div>
      )}
      {mediaType === "video" && videoUrl && <VideoCard videoUrl={videoUrl} />}
      {/* {caption && (
        <div className=" p-3 bg-black/40 backdrop-blur-sm">
          <p className="text-white text-xs">{caption}</p>
        </div>
      )} */}
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

  if (!items.length) return null;

  return (
    <section className="relative overflow-hidden h-screen snap-center">
      <InView>
        <div className="h-screen flex flex-col items-center">
          <div className="w-full my-auto">
            <SmallTitle>What our clients say</SmallTitle>
            <div
              ref={railRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              className="mt-4 flex gap-2 overflow-x-auto pb-4 scrollbar-hide cursor-grab"
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
          </div>
        </div>
      </InView>
    </section>
  );
}
