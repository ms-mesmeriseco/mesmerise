"use client";

import { useEffect, useState, useRef } from "react";

const MIN_DISPLAY_MS = 800;
const FADE_DURATION_MS = 600;
const MOBILE_BREAKPOINT = 640; // Adjust to your needs

export default function HeroLoader({ visible = true }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  const timerDoneRef = useRef(false);
  const appReadyRef = useRef(false);
  const exitTriggeredRef = useRef(false);

  useEffect(() => {
    // 1. Check for mobile immediately
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    if (isMobile) {
      // If mobile, don't even start the timer, just kill the loader
      setUnmounted(true);
      return;
    }

    // 2. Desktop logic: Start the minimum stay timer
    const t = setTimeout(() => {
      timerDoneRef.current = true;
      if (appReadyRef.current) triggerExit();
    }, MIN_DISPLAY_MS);

    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Listen for the 'visible' prop change (only relevant for desktop)
    if (!visible) {
      appReadyRef.current = true;
      if (timerDoneRef.current) triggerExit();
    }
  }, [visible]);

  function triggerExit() {
    if (exitTriggeredRef.current) return;
    exitTriggeredRef.current = true;

    requestAnimationFrame(() => {
      setFadeOut(true);
    });

    setTimeout(() => {
      setUnmounted(true);
    }, FADE_DURATION_MS);
  }

  // If we've decided it's mobile or the animation is done, render nothing
  if (unmounted) return null;

  return (
    <>
      <style>{`
        /* Double-check with CSS to prevent a flash of content before JS hydrations */
        @media (max-width: ${MOBILE_BREAKPOINT - 1}px) {
          .hero-loader-container { display: none !important; }
        }
        @keyframes pulseFade {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.98); }
        }
        .animate-pulse-fade {
          animation: pulseFade 2.5s ease-in-out infinite;
        }
      `}</style>

      <div
        className="hero-loader-container"
        style={{
          background: "var(--background)",
          display: "flex",
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          transition: `opacity ${FADE_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), 
                       visibility ${FADE_DURATION_MS}ms`,
          opacity: fadeOut ? 0 : 1,
          visibility: fadeOut ? "hidden" : "visible",
          pointerEvents: "none",
        }}
      >
        <div className={fadeOut ? "" : "animate-pulse-fade"}>
          <svg
            viewBox="0 0 894.74 533.35"
            fill="currentColor"
            style={{
              width: 300,
              height: "auto",
              display: "block",
              color: "white",
            }}
            aria-label="Logo"
          >
            <g className="hero-stripe hero-stripe-1">
              <path d="M879.88,0h-18.94c-12.8,0-24.49,7.29-30.12,18.79l-125.62,256.53c-5.44,11.1-8.26,23.3-8.26,35.67v207.6h0v14.78h197.81V14.86c0-8.21-6.65-14.86-14.86-14.86Z" />
            </g>
            <g className="hero-stripe hero-stripe-2">
              <path d="M747.17,0h-175.3c-13.14,0-25.13,7.46-30.94,19.24l-42.32,85.91h-.04l-210.92,428.13h23.38c.2,0,.37.08.57.08h175.96c.36,0,.71-.06,1.07-.08h20.25l9.18-18.63c.07-.14.17-.27.24-.42L760.82,21.95c4.98-10.12-2.38-21.95-13.66-21.95Z" />
            </g>
            <g className="hero-stripe hero-stripe-3">
              <path d="M459.48,0h-175.3c-13.14,0-25.13,7.46-30.94,19.25l-40.82,82.86h0L0,533.28h23.35c.2,0,.37.08.57.08h175.96c.36,0,.71-.06,1.07-.08h20.28l9.36-19.01s.01-.02.02-.04L473.14,21.95c4.98-10.12-2.38-21.95-13.66-21.95Z" />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}
