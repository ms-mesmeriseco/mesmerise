import { motion } from "framer-motion";

export default function SecondaryButton({
  href = "#",
  children,
  className = "",
  size = "small", // default to "small"
  ...props
}) {
  const isLarge = size === "large";
  const isXLarge = size === "x-large";
  const isSmall = size === "small";

  const basePadding = isLarge ? "1.5rem" : isXLarge ? "2rem" : "1rem";
  const hoverPadding = isLarge ? "2rem" : isXLarge ? "2.75rem" : "1.5rem";
  const height = isLarge ? "45px" : isXLarge ? "64px" : "32px";
  const radius = isLarge
    ? "rounded-lg"
    : isXLarge
    ? "rounded-2xl"
    : "rounded-sm";
  const fontSize = isLarge ? "text-lg" : isXLarge ? "text-3xl" : "text-sm";

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
      className={`w-fit text-[var(--background)] ${fontSize} ${radius} transition bg-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--background)] ${className}`}
      {...props}
    >
      {children}
    </motion.a>
  );
}
