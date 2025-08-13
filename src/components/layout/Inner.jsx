"use client";

import { motion } from "framer-motion";

export default function Inner({ children }) {
  const anim = (variants) => {
    return {
      initial: "initial",
      animate: "animate",
      exit: "exit",
      variants,
    };
  };

  const opacity = {
    initial: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
    animate: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div {...anim(opacity)} className="pt-18">
      {children}
    </motion.div>
  );
}
