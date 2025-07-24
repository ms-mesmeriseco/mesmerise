import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function InView({
  children,
  variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  once = true,
  as: Tag = "div",
  ...rest
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={variants}
      {...rest}
      as={Tag}
    >
      {children}
    </motion.div>
  );
}
