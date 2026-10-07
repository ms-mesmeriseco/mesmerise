"use client";
import { useEffect, useRef, useState } from "react";

// Fixed bottom bar: reading progress fill + post title + share links.
// Progress is measured against the element with id `targetId` (the article).
export default function BlogProgressBar({
  title,
  url,
  targetId = "blog-article",
}) {
  const fillRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(url || "");

  useEffect(() => {
    if (!url) setShareUrl(window.location.href);
  }, [url]);

  useEffect(() => {
    const target = document.getElementById(targetId);
    const fill = fillRef.current;
    if (!fill) return;

    let goal = 0;
    let current = 0;
    let frame = null;

    function measure() {
      let pct;
      if (target) {
        const rect = target.getBoundingClientRect();
        const start = rect.top + window.scrollY;
        const total = target.offsetHeight - window.innerHeight;
        pct = total > 0 ? (window.scrollY - start) / total : 1;
      } else {
        const total =
          document.documentElement.scrollHeight - window.innerHeight;
        pct = total > 0 ? window.scrollY / total : 1;
      }
      return Math.min(1, Math.max(0, pct));
    }

    function render() {
      fill.style.transform = `scaleX(${current})`;
      fill.setAttribute("aria-valuenow", Math.round(current * 100));
    }

    // Ease the fill toward the scroll position each frame; stop once settled
    function tick() {
      current += (goal - current) * 0.15;
      if (Math.abs(goal - current) < 0.0005) {
        current = goal;
        frame = null;
      } else {
        frame = requestAnimationFrame(tick);
      }
      render();
    }

    function onScroll() {
      goal = measure();
      if (frame === null) frame = requestAnimationFrame(tick);
    }

    goal = current = measure();
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  }

  const encUrl = encodeURIComponent(shareUrl);
  const encTitle = encodeURIComponent(title || "");

  const iconClass =
    "flex items-center justify-center w-6 h-6 opacity-80 hover:opacity-100 duration-200";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 h-8 bg-[var(--mesm-l-grey)]/10 backdrop-blur-sm text-white text-sm overflow-hidden"
      role="region"
      aria-label="Reading progress"
    >
      {/* Progress fill */}
      <div
        ref={fillRef}
        className="absolute inset-0 origin-left bg-[var(--mesm-grey)] will-change-transform"
        style={{ transform: "scaleX(0)" }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <div className="relative h-full flex items-center justify-between gap-4 px-4 md:px-5">
        <h6 className="truncate min-w-0 pt-1 ">
          <span className="hidden sm:inline opacity-50">Now reading: </span>
          <span className="f">{title}</span>
        </h6>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline mr-1">
            {copied ? "Link copied" : "Share"}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            className={iconClass}
            aria-label="Copy link"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </button>

          <a
            href={`mailto:?subject=${encTitle}&body=${encUrl}`}
            className={iconClass}
            aria-label="Share by email"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </a>

          <a
            href={`https://x.com/intent/post?url=${encUrl}&text=${encTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className={iconClass}
            aria-label="Share on X"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={iconClass}
            aria-label="Share on LinkedIn"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
