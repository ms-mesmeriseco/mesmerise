import { motion } from "framer-motion";

export default function SecondaryButton({
  href = "#",
  children,
  className = "",
  size = "small", // default to "small"
  ...props
}) {
  const isLarge = size === "large";

  const basePadding = isLarge ? "1.5rem" : "0.5rem";
  const hoverPadding = isLarge ? "2rem" : "1.0rem";
  const height = isLarge ? "45px" : "32px";

  const radius = isLarge ? "rounded-xl" : "rounded-md";

  return (
    <motion.a
      href={href}
      style={{
        paddingLeft: basePadding,
        paddingRight: basePadding,
        height,
        display: "inline-block",
        lineHeight: height,
        boxSizing: "border-box",
      }}
      whileHover={{
        paddingLeft: hoverPadding,
        paddingRight: hoverPadding,
      }}
      transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
      className={`w-fit border border-[var(--foreground)] text-[var(--foreground)] text-sm ${radius} transition hover:bg-[var(--foreground)] hover:text-[var(--background)] ${className}`}
      {...props}
    >
      {children}
    </motion.a>
  );
}
