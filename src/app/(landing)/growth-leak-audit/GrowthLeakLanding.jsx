"use client";

import { useEffect, useState } from "react";
import StaggeredWords from "@/hooks/StaggeredWords";
import TrustedBy from "@/components/home/TrustedBy";
import TestimonialsRail from "@/components/home/TestimonialRail";
import SmallTitle from "@/components/ui/SmallTitle";
import CtaBentoBox from "@/components/sanity-blocks/CtaBentoBox";
import { LANDING, LANDING_BENTO } from "@/lib/quiz/quizData";
import Quiz from "./Quiz";
import Image from "next/image";
import HeroButton from "@/components/ui/HeroButton";

const START_HASH = "#start-quiz";

// Join-style landing with its own hero; the CTA starts the quiz in place of the page
export default function GrowthLeakLanding() {
  const [started, setStarted] = useState(false);

  function toggle(next) {
    setStarted(next);
    window.scrollTo({ top: 0 });
  }

  // Links to #start-quiz (bento box, ads) open the quiz directly
  useEffect(() => {
    if (window.location.hash === START_HASH) setStarted(true);
  }, []);

  function startFromLink(e) {
    const link = e.target.closest(`a[href="${START_HASH}"]`);
    if (!link) return;
    e.preventDefault();
    toggle(true);
  }

  if (started) {
    return (
      <div className="flex flex-col min-h-screen pt-12 pb-48 px-[var(--global-margin-sm)]">
        <Quiz skipIntro onExit={() => toggle(false)} />
      </div>
    );
  }

  return (
    <>
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-[var(--global-margin-sm)] md:py-16">
        <div className="max-w-4xl flex flex-col items-center gap-6 md:gap-8">
          <div className="flex items-center justify-center w-16 h-16 p-0 rounded-full bg-white/10 border-1 border-[var(--mesm-grey)]/20">
            <Image
              src="/logoMark-SVG_mesm.svg"
              alt="Mesmerise Digital"
              width={36}
              height={36}
              priority
            />
          </div>
          <StaggeredWords as="h1" delay={0.01} text={LANDING.header} />
          <p className="p2 max-w-2xl text-[var(--mesm-l-grey)]">
            {LANDING.subtitle}
          </p>
          <HeroButton onClick={() => toggle(true)}>{LANDING.button}</HeroButton>
        </div>
      </section>
      <div className="flex w-full flex-col">
        <TrustedBy />
        <TestimonialsRail />
      </div>
      <div
        className="px-[var(--global-margin-sm)] pb-24"
        onClickCapture={startFromLink}
      >
        <CtaBentoBox
          block={{
            ...LANDING_BENTO,
            ctaLink1: START_HASH,
            ctaLink2: START_HASH,
          }}
          linkLabel={LANDING_BENTO.linkLabel}
        />
      </div>
    </>
  );
}
