"use client";

import { useEffect, useRef, useState } from "react";

export default function useSectionMarker() {
  const [label, setLabel] = useState("hello"); // default for hero
  const observer = useRef();

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setLabel(e.target.dataset.marker);
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px", // triggers when near vertical center
        threshold: 0,
      }
    );

    const sections = document.querySelectorAll("[data-marker]");
    sections.forEach((section) => observer.current.observe(section));

    return () => {
      sections.forEach((section) => observer.current.unobserve(section));
    };
  }, []);

  return label;
}
