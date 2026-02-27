"use client";

import { useState } from "react";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import InView from "@/hooks/InView";
import { motion, AnimatePresence } from "framer-motion";

export default function TestimonialsCarousel({ block }) {
  if (!block) return null;

  const { carouselTitle, testimonials = [], entryTitle, _id, _type } = block;

  if (!testimonials.length) {
    if (process.env.NODE_ENV === "development") {
      console.log("TestimonialsCarousel: no testimonials", { _id, _type });
    }
    return null;
  }

  const [[index, direction], setIndexAndDirection] = useState([0, 0]);
  const current = testimonials[index];

  const paginate = (newDirection) => {
    setIndexAndDirection(([prevIndex]) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0 || nextIndex > testimonials.length - 1) {
        return [prevIndex, 0];
      }
      return [nextIndex, newDirection];
    });
  };

  const goPrev = () => paginate(-1);
  const goNext = () => paginate(1);

  const atStart = index === 0;
  const atEnd = index === testimonials.length - 1;

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 24 : -24,
      opacity: 0,
      scale: 0.995,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -24 : 24,
      opacity: 0,
      scale: 0.995,
    }),
  };

  return (
    <InView>
      <section className="my-16 w-full">
        <div className="max-w-4xl mx-auto px-6 md:px-0 flex flex-col gap-4">
          {/* Heading */}
          {(carouselTitle || entryTitle) && (
            <div className="mb-10 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--foreground)]">
                {carouselTitle || entryTitle}
              </h2>
            </div>
          )}

          {/* Card */}
          <div className="relative rounded-2xl bg-[var(--mesm-grey)]/30 px-6 py-8 md:px-10 md:py-10 flex flex-col md:gap-6 gap-4 justify-center items-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="w-full flex flex-col md:gap-6 gap-4 justify-center items-center"
              >
                {/* Author / meta */}
                {current?.logo && (
                  <div className="h-12 w-12 rounded-full bg-black/40 flex items-center justify-center overflow-hidden">
                    <Image
                      src={current.logo}
                      alt={current.author || current.role || "Logo"}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                )}

                <div className="flex flex-col text-center">
                  {current?.author && (
                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      {current.author}
                    </span>
                  )}
                  {current?.role && (
                    <span className="text-sm text-[var(--mesm-l-grey)]">
                      {current.role}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="mb-6 text-center">
                  <div className="text-sm md:text-base text-[var(--mesm-l-grey)] leading-relaxed space-y-3">
                    {current?.body && <PortableText value={current.body} />}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav */}
          <div className="flex items-center gap-4 m-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={goPrev}
                disabled={atStart}
                className={`h-5 w-5 rounded-full border border-[var(--mesm-blue)] ${
                  atStart
                    ? "opacity-40 cursor-default bg-transparent"
                    : "bg-[var(--mesm-blue)] hover:bg-transparent duration-200 cursor-pointer"
                }`}
              />

              <button
                type="button"
                aria-label="Next testimonial"
                onClick={goNext}
                disabled={atEnd}
                className={`h-5 w-5 rounded-full border border-[var(--mesm-blue)] ${
                  atEnd
                    ? "opacity-40 cursor-default bg-transparent"
                    : "bg-[var(--mesm-blue)] hover:bg-transparent duration-200 cursor-pointer"
                }`}
              />
            </div>
          </div>
        </div>
      </section>
    </InView>
  );
}
