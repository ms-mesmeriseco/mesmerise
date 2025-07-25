"use client";

import PropTypes from "prop-types";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export default function TrustBadges({ textContent, logos = [], scroll }) {
  const duplicatedLogos = scroll ? [...logos, ...logos] : logos;

  return (
    <section className="w-full py-8 overflow-hidden">
      <div className="flex gap-8 items-center">
        {/* Text content block (15%) */}
        {textContent?.json && (
          <div className="w-2/12 min-w-[120px]">
            {documentToReactComponents(textContent.json)}
          </div>
        )}
        {/* Logo area (85%) */}
        <div
          className={`${
            textContent ? "w-10/12" : "w-12/12"
          } w-10/12 overflow-hidden`}
        >
          <div
            className={`flex items-center gap-50 ${
              scroll
                ? "animate-scroll-horizontal whitespace-nowrap"
                : "flex-wrap"
            }`}
          >
            {duplicatedLogos.map((logo, idx) => (
              <Image
                key={`logo-${idx}`}
                src={logo.url}
                alt={logo.title || ""}
                width={80}
                height={80}
                className="object-contain"
              />
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
