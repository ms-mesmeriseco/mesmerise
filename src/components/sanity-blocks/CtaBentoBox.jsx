// src/components/sanity-blocks/CtaBentoBox.jsx
"use client";

import Link from "next/link";
import { PortableText } from "@portabletext/react";
import InView from "@/hooks/InView";
import Image from "next/image";

export default function CtaBentoBox({ block }) {
  if (!block) return null;

  const { bentoTitle, ctaBox1, ctaLink1, ctaBox2, ctaLink2 } = block;

  const heading = bentoTitle;

  /** CTA button styling **/
  const btn =
    "group flex flex-col justify-between rounded-xl border border-[var(--mesm-grey)]/20 " +
    "bg-black/70 px-6 py-6 md:px-8 md:py-8 text-left transition-all " +
    "hover:border-[var(--mesm-blue)]/60 hover:bg-black/40";

  const body =
    "text-sm md:text-base text-[var(--mesm-l-grey)] leading-snug space-y-2";

  return (
    <InView>
      <section className="narrow-wrapper my-12 w-full bg-[var(--mesm-grey)]/20 border border-[var(--mesm-grey)]/20 py-12 px-6 md:px-12 rounded-2xl flex flex-col justify-center items-center">
        <div className="mx-auto w-full max-w-5xl">
          {/* Header */}
          {heading && (
            <div className="mb-16 flex flex-col justify-center items-center gap-4">
              <Image
                src="/display-picture-RED-180px.png"
                alt="Mesmerise Digital"
                width={48}
                height={48}
                priority
                className="rounded-full"
              />
              <h2 className="text-center text-2xl md:text-3xl font-semibold">
                {heading}
              </h2>
            </div>
          )}

          {/* Two-column Bento CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
            {ctaLink1 && (
              <Link href={ctaLink1} className={btn}>
                <div className={body}>
                  {ctaBox1 && <PortableText value={ctaBox1} />}
                </div>

                <span className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--mesm-blue)] group-hover:gap-3 transition-all">
                  Learn more
                </span>
              </Link>
            )}

            {ctaLink2 && (
              <Link href={ctaLink2} className={btn}>
                <div className={body}>
                  {ctaBox2 && <PortableText value={ctaBox2} />}
                </div>

                <span className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--mesm-blue)] group-hover:gap-3 transition-all">
                  Learn more
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </InView>
  );
}
