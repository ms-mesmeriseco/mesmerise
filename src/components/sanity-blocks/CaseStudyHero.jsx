"use client";

import React from "react";
import Image from "next/image";
import Button from "../ui/Button";

export default function CaseStudyHero({ block }) {
  if (!block) return null;

  const { heading, button1, button2, heroImage, stats, logo } = block;

  // Pattern matched to your SingleCaseStudy logic
  const heroSrc =
    typeof heroImage === "string" ? heroImage : heroImage?.url || null;
  const logoSrc = typeof logo === "string" ? logo : logo?.url || null;

  console.log("CaseStudyHero block data:", block);

  return (
    <section className="narrow-wrapper ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Content */}
        <div className="flex flex-col justify-between order-2 md:order-1 h-full py-8">
          <div>
            {logoSrc && (
              <div className="relative mb-8 h-12 w-32">
                <Image
                  src={logoSrc}
                  alt="Brand Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            )}

            <h2 className="mb-10">{heading}</h2>

            <div className="flex flex-wrap gap-4 mb-16">
              {button1?.label && (
                <Button href={button1.url} variant="primary" size="large">
                  {button1.label}
                </Button>
              )}

              {button2?.label && (
                <Button href={button2.url} variant="secondary" size="large">
                  {button2.label}
                </Button>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-10 md:gap-20">
            {stats?.map((stat) => (
              <div key={stat._key} className="flex flex-col">
                <span className="font-semibold text-[4rem]/[4.2rem]">
                  {stat.value}
                </span>
                <h5 className="text-sm">{stat.label}</h5>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Hero Image */}
        <div className="order-1 md:order-2">
          {heroSrc && (
            <div className="relative rounded-md overflow-hidden aspect-[1/1] shadow-sm">
              <Image
                src={heroSrc}
                alt={heading || "Case Study Hero"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
