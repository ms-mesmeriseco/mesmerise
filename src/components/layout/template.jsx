"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const PixelTracker = dynamic(() => import("@/lib/utils/PixelTracker"), {
  ssr: false,
});

export default function Template({ children }) {
  const pathname = usePathname();
  const paddingTop = pathname === "/" ? "pt-0" : "md:pt-24 pt-18";
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
    <motion.div
      {...anim(opacity)}
      className={`${paddingTop} min-h-screen   p-[var(--global-margin-sm)]`}
    >
      <PixelTracker />
      {children}
    </motion.div>
  );
}
