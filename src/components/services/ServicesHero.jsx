"use client";

import ServiceTags from "@/components/services/ServiceTags";
import PageTitleLarge from "../layout/PageTitleLarge";

function isVideo(src) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

export default function ServicesHero({ heroTitle, serviceTags, heroMedia }) {
  return (
    <div className="flex flex-col gap-[var(--global-margin-sm)]">
      {/* <PageTitleLarge text={heroTitle} /> */}
      <h1 className="page-title-large">{heroTitle}</h1>
      <ServiceTags items={serviceTags} />
      <section className="h-[50vh] flex items-center justify-center">
        {isVideo(heroMedia) ? (
          <video
            src={heroMedia}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <img
            src={heroMedia}
            alt="Hero Media"
            className="w-full h-full object-cover rounded-2xl"
          />
        )}
      </section>

      {/* Tags */}
    </div>
  );
}
