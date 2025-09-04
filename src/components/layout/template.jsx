"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }) {
  const pathname = usePathname();
  const paddingTop = pathname === "/" ? "pt-0" : "pt-18";
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
    <motion.div {...anim(opacity)} className={`${paddingTop} min-h-screen`}>
      {children}
    </motion.div>
  );
}
