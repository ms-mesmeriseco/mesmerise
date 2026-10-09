"use client";

import { useEffect, useState } from "react";
import StaggeredWords from "@/hooks/StaggeredWords";
import TrustedByMarquee from "@/components/home/TrustedByMarquee";
import TestimonialsRail from "@/components/home/TestimonialRail";
import Button from "@/components/ui/Button";
import CtaBentoBox from "@/components/sanity-blocks/CtaBentoBox";
import ListIconsFocus from "@/components/sanity-blocks/ListIconsFocus";
import FAQ from "@/components/blocks/FAQ";
import {
  LANDING,
  LANDING_BENTO,
  LANDING_FOCUS,
  LANDING_FAQ,
} from "@/lib/quiz/quizData";
import Quiz from "./Quiz";
import StarEyebrow from "./StarEyebrow";
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
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-[var(--global-margin-sm)] md:py-16">
        <div className="max-w-5xl flex flex-col items-center gap-6 md:gap-8">
          <StarEyebrow>
            For business owners & ambitious entrepreneurs
          </StarEyebrow>
          <StaggeredWords
            as="h1"
            delay={0.01}
            className="p"
            text="Find out exactly where your marketing is leaking"
          />

          <HeroButton onClick={() => toggle(true)}>Find my leaks</HeroButton>
          <h5 className="">
            <em>4 minutes &nbsp;· &nbsp;Free</em>
          </h5>
        </div>
      </section>

      <div className="flex w-full flex-col gap-24">
        <TrustedByMarquee />
        <div className="py-24">
          <ListIconsFocus block={LANDING_FOCUS} />
          <div className="text-center flex flex-col items-center gap-8 pt-24">
            <h2 className="page-title-medium">
              Find out which ones are costing you
            </h2>
            <HeroButton onClick={() => toggle(true)}>Find my leaks</HeroButton>
          </div>
        </div>
        <TestimonialsRail />
        <div className="px-[var(--global-margin-sm)]">
          <FAQ
            label="common questions"
            title="Frequently asked questions"
            items={LANDING_FAQ}
            defaultOpen={[0]}
          />
        </div>
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
