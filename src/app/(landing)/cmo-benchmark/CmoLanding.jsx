"use client";

import { useEffect, useState } from "react";
import StaggeredWords from "@/hooks/StaggeredWords";
import HeroButton from "@/components/ui/HeroButton";
import AvatarRow from "@/components/ui/AvatarRow";
import { INTRO } from "@/lib/cmo-benchmark/quizData";
import StarEyebrow from "../growth-leak-audit/StarEyebrow";
import CmoQuiz from "./CmoQuiz";
import { loadProgress, clearProgress } from "./progress";
import TrustedByMarquee from "@/components/home/TrustedByMarquee";
import TestimonialsRail from "@/components/home/TestimonialRail";

// The hero is the intro screen; starting swaps it for the quiz in place
export default function CmoLanding() {
  const [started, setStarted] = useState(false);
  // Saved progress from an earlier visit, read after mount (storage is client-only)
  const [saved, setSaved] = useState(null);
  const [resumeFrom, setResumeFrom] = useState(null);

  useEffect(() => {
    const progress = loadProgress();
    if (progress && Object.keys(progress.answers).length) setSaved(progress);
  }, []);

  function start(from) {
    setResumeFrom(from);
    setStarted(true);
    window.scrollTo({ top: 0 });
  }

  function restart() {
    clearProgress();
    setSaved(null);
    start(null);
  }

  function exit() {
    // Back on the first question: return to the hero, keeping anything answered
    setSaved(loadProgress());
    setStarted(false);
    window.scrollTo({ top: 0 });
  }

  if (started) {
    return (
      <div className="flex flex-col min-h-screen pt-12 pb-48 px-[var(--global-margin-sm)]">
        <CmoQuiz initial={resumeFrom} onExit={exit} />
      </div>
    );
  }

  return (
    <section className="min-h-[80vh] flex flex-col items-start justify-center text-left px-[var(--global-margin-sm)] md:items-center md:text-center md:py-16">
      <div className="max-w-5xl flex flex-col items-start gap-6 md:items-center md:gap-8">
        <StarEyebrow>{INTRO.eyebrow}</StarEyebrow>
        <StaggeredWords
          as="h1"
          delay={0.01}
          className="p"
          text={INTRO.headline}
        />
        <p className="p2 max-w-2xl text-[var(--mesm-l-grey)]">{INTRO.body}</p>

        {saved ? (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:justify-center">
            <HeroButton onClick={() => start(saved)}>
              {INTRO.resumeButton}
            </HeroButton>
            <button
              type="button"
              onClick={restart}
              className="text-[var(--mesm-l-grey)] hover:text-[var(--foreground)] underline underline-offset-4 duration-200"
            >
              {INTRO.restart}
            </button>
          </div>
        ) : (
          <HeroButton onClick={() => start(null)}>{INTRO.button}</HeroButton>
        )}
        <h5>
          <em>{INTRO.meta.join(" · ")}</em>
        </h5>
        <AvatarRow />
      </div>
      <div className="flex w-full flex-col gap-24">
        <TrustedByMarquee />
        <TestimonialsRail />
      </div>
    </section>
  );
}
