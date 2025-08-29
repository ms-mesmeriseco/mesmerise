"use client";

import ServiceTags from "@/components/services/ServiceTags";
import PageTitleLarge from "../layout/PageTitleLarge";

function isVideo(src) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

export default function ServicesHero({ heroTitle, serviceTags, heroMedia }) {
  return (
    <div className="flex flex-col gap-[var(--global-margin-sm)]">
      <PageTitleLarge text={heroTitle} />
      <ServiceTags items={serviceTags} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <section className="max-h-[90vh]  flex items-center justify-center">
        {isVideo(heroMedia) ? (
          <video
            src={heroMedia}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full md:aspect-16/9 object-cover rounded-lg"
          />
        ) : (
          <img
            src={heroMedia}
            alt="Hero Media"
            className="w-full h-full  md:aspect-16/9 object-cover rounded-lg"
          />
        )}
      </section>

      {/* Tags */}
    </div>
  );
}
