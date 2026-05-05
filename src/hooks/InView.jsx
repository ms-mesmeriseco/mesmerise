"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin (important!)
gsap.registerPlugin(ScrollTrigger);

export default function InView({
  children,
  once = true,
  // Equivalent to your -30% margin:
  // "top 70%" means when the top of the element hits 70% of viewport height
  start = "top 70%",
  className = "",
  ...rest
}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;

    // Set initial state (Hidden)
    gsap.set(el, {
      opacity: 0,
      y: 40,
    });

    // Create the trigger
    const anim = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: start, // When to start
        toggleActions: once
          ? "play none none none"
          : "play reverse play reverse",
        // markers: true, // Uncomment this to see the trigger lines during dev!
      },
    });

    // Cleanup on unmount
    return () => {
      anim.kill();
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
    };
  }, [once, start]);

  return (
    <div ref={elementRef} className={className} {...rest}>
      {children}
    </div>
  );
}
