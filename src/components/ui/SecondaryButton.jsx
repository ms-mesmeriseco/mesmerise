import { motion } from "framer-motion";

export default function SecondaryButton({
  href = "#",
  children,
  className = "",
  size = "small", // default to "small"
  ...props
}) {
  const isLarge = size === "large";

  const basePadding = isLarge ? "1.5rem" : "1rem";
  const hoverPadding = isLarge ? "2rem" : "1.5rem";
  const height = isLarge ? "40px" : "32px";
  const radius = isLarge ? "rounded-md" : "rounded-xs";

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
      className={`w-fit text-[var(--background)] text-sm ${radius} transition bg-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--background)] ${className}`}
      {...props}
    >
      {children}
    </motion.a>
  );
}
