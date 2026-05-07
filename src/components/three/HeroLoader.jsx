"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { useHeroLoader } from "@/components/three/HeroLoaderProvider";
import gsap from "gsap";

const MIN_DISPLAY_MS = 3600; // Snappier timing for better UX
const MOBILE_BREAKPOINT = 640;

export default function HeroLoader() {
  const [unmounted, setUnmounted] = useState(false);
  const pathname = usePathname();
  const { sceneReady } = useHeroLoader();

  const containerRef = useRef(null);
  const timerDoneRef = useRef(false);
  const appReadyRef = useRef(false);
  const introFinishedRef = useRef(false);
  const exitTriggeredRef = useRef(false);

  useEffect(() => {
    if (pathname !== "/") {
      setUnmounted(true);
      return;
    }

    // GSAP initial state matches CSS to ensure a smooth handoff
    gsap.set(".hero-stripe", { y: "105%", opacity: 0 });
    gsap.set(".char-inner", { y: "105%" });
    gsap.set(".hero-m", { x: 40 });

    const introTl = gsap.timeline({
      delay: 0.5,
      onComplete: () => {
        introFinishedRef.current = true;
        if (sceneReady) triggerExit();
      },
    });

    introTl
      .to(
        ".char-inner",
        {
          y: "0%",
          duration: 0.6,
          stagger: 0,
          ease: "expo.out",
        },
        "-=0.0",
      )
      .to(
        ".hero-m",
        {
          x: 0,
          duration: 1.2,
          ease: "expo.inOut",
        },
        "-=0.8",
      )
      .to(".hero-stripe", {
        y: "0%",
        opacity: 1,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
      });

    const t = setTimeout(() => {
      timerDoneRef.current = true;
      if (appReadyRef.current) triggerExit();
    }, MIN_DISPLAY_MS);

    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (sceneReady) {
      appReadyRef.current = true;
      if (timerDoneRef.current) triggerExit();
    }
  }, [sceneReady]);

  function triggerExit() {
    if (exitTriggeredRef.current) return;
    exitTriggeredRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => setUnmounted(true),
    });

    tl.to(".char-inner", {
      y: "-105%",
      rotateX: 40,
      duration: 0.8,

      stagger: 0,
      ease: "expo.inOut",
    })
      .to(
        ".hero-stripe",
        {
          y: "-105%",
          opacity: 0,
          duration: 0.8,
          stagger: 0.02,
          ease: "expo.inOut",
        },
        "-=0.7",
      )
      .to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
        },
        "-=0.4",
      );
  }

  if (unmounted || pathname !== "/") return null;

  const text = "Future proof your business";

  return (
    <>
      <style>{`
        @media (max-width: ${MOBILE_BREAKPOINT - 1}px) {
          .hero-loader-container { display: none !important; }
        }
        /* CSS to prevent FOUC (Flash of Unstyled Content) */
        .hero-stripe { opacity: 0; }
        .hero-m { transform: translateX(40px); }
        .char-inner {
          transform: translateY(105%);
          display: inline-block;
          transform-origin: top;
          will-change: transform;
        }
        .loader-text {
          font-weight: 400;
      letter-spacing: 0.1em;
          color: white;
          margin-left: 24px;
          font-size: clamp(0.8rem, 1.5vw, 1rem);
          display: flex;
          perspective: 1000px;
        }
        .char-mask {
          overflow: hidden;
          display: inline-block;
          height: 1.2em;
          line-height: 1.2em;
        }
      `}</style>

      <div
        ref={containerRef}
        className="hero-loader-container"
        style={{
          background: "var(--background)",
          display: "flex",
          position: "fixed",
          inset: 0,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg
            viewBox="0 0 894.74 533.35"
            fill="currentColor"
            style={{
              width: 80,
              height: "auto",
              display: "block",
              color: "white",
            }}
            className="hero-m"
          >
            <g className="hero-stripe" style={{ overflow: "hidden" }}>
              <path d="M879.88,0h-18.94c-12.8,0-24.49,7.29-30.12,18.79l-125.62,256.53c-5.44,11.1-8.26,23.3-8.26,35.67v207.6h0v14.78h197.81V14.86c0-8.21-6.65-14.86-14.86-14.86Z" />
            </g>
            <g className="hero-stripe">
              <path d="M747.17,0h-175.3c-13.14,0-25.13,7.46-30.94,19.24l-42.32,85.91h-.04l-210.92,428.13h23.38c.2,0,.37.08.57.08h175.96c.36,0,.71-.06,1.07-.08h20.25l9.18-18.63c.07-.14.17-.27.24-.42L760.82,21.95c4.98-10.12-2.38-21.95-13.66-21.95Z" />
            </g>
            <g className="hero-stripe">
              <path d="M459.48,0h-175.3c-13.14,0-25.13,7.46-30.94,19.25l-40.82,82.86h0L0,533.28h23.35c.2,0,.37.08.57.08h175.96c.36,0,.71-.06,1.07-.08h20.28l9.36-19.01s.01-.02.02-.04L473.14,21.95c4.98-10.12-2.38-21.95-13.66-21.95Z" />
            </g>
          </svg>

          <div className="loader-text">
            {text.split("").map((char, i) => (
              <span key={i} className="char-mask">
                <span className="char-inner">
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
