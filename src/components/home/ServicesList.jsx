"use client";
import { useEffect, useRef, useState } from "react";

const services = [
  "Digital marketing",
  "Growth architecture",
  "Positioning",
  "Brand strategy",
  "Design",
  "Full-stack web development",
  "UI / UX",
];

export default function ServicesList() {
  const refs = useRef([]);
  const [, force] = useState();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          e.target.dataset.active = e.isIntersecting ? "true" : "false";
          force({});
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    refs.current.filter(Boolean).forEach((el) => io.observe(el));

    return () => {
      refs.current.filter(Boolean).forEach((el) => io.unobserve(el));
    };
  }, []);

  return (
    <section data-marker="services" className="min-h-screen flex flex-col justify-center px-[var(--global-margin)]">
      <ul className="space-y-4">
        {services.map((s, idx) => (
          <li
            key={s}
            ref={(el) => (refs.current[idx] = el)}
            className={`border-b border-current pb-2 text-4xl md:text-6xl transition-all
              ${refs.current[idx]?.dataset.active === "true" ? "pl-4 opacity-100" : "opacity-90"}`}
          >
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
