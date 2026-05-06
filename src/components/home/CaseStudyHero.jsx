"use client";

import React from "react";
import Image from "next/image";
import Button from "../ui/Button";
import StaggeredWords from "@/hooks/StaggeredWords";

export default function CaseStudyHero({ block, narrow = true }) {
  if (!block) return null;

  const { heading, button1, button2, heroImage, stats, logo, eyebrow } = block;

  // Pattern matched to your SingleCaseStudy logic
  const heroSrc =
    typeof heroImage === "string" ? heroImage : heroImage?.url || null;
  const logoSrc = typeof logo === "string" ? logo : logo?.url || null;

  // console.log("CaseStudyHero block data:", block);

  return (
    <section className={narrow ? "narrow-wrapper w-full" : "w-full"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center md:h-[600px] h-fit">
        {/* Left Column: Content */}
        <div className="flex flex-col gap-2 order-2 md:order-1 h-full ">
          <div className="flex flex-col justify-between border-1 border-[var(--mesm-grey-dk)] rounded-lg p-6 h-full">
            <div>
              {/* {logoSrc && (
                <div className="relative mb-8 h-12 w-32">
                  <Image
                    src={logoSrc}
                    alt="Brand Logo"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              )} */}

              <h5>{eyebrow}</h5>
              <StaggeredWords as="h3" text={heading} className="mb-6 " />
            </div>
            <div className="flex flex-wrap gap-2 ">
              {button1?.label && (
                <Button href={button1.link} variant="accent2" size="large">
                  {button1.label}
                </Button>
              )}

              {button2?.label && (
                <Button href={button2.link} variant="secondary" size="large">
                  {button2.label}
                </Button>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-2 ">
            {stats?.map((stat) => (
              <div
                key={stat._key}
                className="flex flex-col flex-1 border-1 border-[var(--mesm-grey-dk)] rounded-lg p-6 "
              >
                <span className="text-[4.2rem]/[4.6rem]">{stat.value}</span>
                <h6 className="text-sm">{stat.label}</h6>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Hero Image */}
        <div className="order-1 md:order-2 w-[100%] md:h-[100%] h-[60vh]">
          {heroSrc && (
            <div className="relative overflow-hidden h-full w-full shadow-sm">
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
