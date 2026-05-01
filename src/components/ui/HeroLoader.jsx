"use client";

import { useEffect, useState, useRef } from "react";

const MIN_DISPLAY_MS = 2000;
const FADE_DURATION_MS = 600;

export default function HeroLoader({ visible = true }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  const animDoneRef = useRef(false);
  const pendingExitRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      animDoneRef.current = true;
      if (pendingExitRef.current) triggerExit();
    }, MIN_DISPLAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) {
      if (animDoneRef.current) {
        triggerExit();
      } else {
        pendingExitRef.current = true;
      }
    }
  }, [visible]);

  function triggerExit() {
    setFadeOut(true);
    setTimeout(() => setUnmounted(true), FADE_DURATION_MS);
  }

  if (unmounted) return null;

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.98); }
        }
        .animate-pulse-fade {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999, // High z-index to stay on top
          background: "var(--background)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: `opacity ${FADE_DURATION_MS}ms ease-in-out, visibility ${FADE_DURATION_MS}ms`,
          opacity: fadeOut ? 0 : 1,
          visibility: fadeOut ? "hidden" : "visible",
          pointerEvents: "none", // Prevent interaction issues during transition
        }}
      >
        <div className={fadeOut ? "" : "animate-pulse-fade"}>
          <svg
            viewBox="0 0 894.74 533.35"
            fill="currentColor" // Uses current text color for easier theme matching
            style={{
              width: 200,
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
