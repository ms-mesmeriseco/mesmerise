"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { computeResults } from "@/lib/quiz/scoring";
import QuizResults from "../../QuizResults";

// answers is null when the link is invalid or expired
export default function SharedResults({ answers, expires, expired }) {
  // The link being viewed, so it can be copied on with its countdown
  const [url, setUrl] = useState(null);
  useEffect(() => setUrl(window.location.href), []);

  if (!answers) {
    return (
      <div className="flex flex-col items-start gap-6 min-h-[60vh] justify-center">
        <h2 className="page-title-medium">
          {expired
            ? "This results link has expired."
            : "This results link isn’t valid."}
        </h2>
        <p className="p2 text-[var(--mesm-l-grey)]">
          Take the Growth Leak Audit again to get a fresh score. It takes about
          4 minutes.
        </p>
        <Button href="/growth-leak-audit" size="large">
          Take the audit
        </Button>
      </div>
    );
  }

  return (
    <QuizResults
      results={computeResults(answers)}
      goal={answers.H3}
      share={url ? { url, expires } : null}
    />
  );
}
