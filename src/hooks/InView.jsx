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
  // NEW: root margin. Default = trigger at viewport center.
  // Use "-40% 0px -40% 0px" for a 20% tall center "band" instead of a line.
  margin = "-30% 0px -30% 0px",
  amount = "some", // keep default threshold behavior
  ...rest
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin, amount });

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
