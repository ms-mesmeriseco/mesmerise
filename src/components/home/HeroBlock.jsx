"use client";
import { motion } from "framer-motion";

const words = ["Innovation.", "Integrity.", "Intelligence."];

const wordVariants = {
  animate: {
    y: ["0rem", "0rem", "-6rem", "-6rem", "-12rem", "-12rem", "0rem"],
    transition: { repeat: Infinity, duration: 5, ease: "easeInOut" },
  },
};

export default function HeroBlock() {
  return (
    <section
      data-marker="hello"
      className="h-[70vh] flex items-center justify-center"
    >
      <div className="overflow-hidden h-[6rem]">
        <motion.div
          variants={wordVariants}
          animate="animate"
          className="flex flex-col gap-0 text-6xl md:text-8xl font-medium leading-none"
        >
          {words.map((w) => (
            <span key={w} className="h-[6rem] font-bold">
              {w}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
