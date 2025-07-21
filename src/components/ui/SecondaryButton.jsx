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
  const height = isLarge ? "44px" : "32px";
  const textSize = isLarge ? "text-lg" : "text-base";
  const radius = isLarge ? "rounded-xl" : "rounded-md";

  return (
    <a href={href} {...props}>
      <motion.button
        style={{
          paddingLeft: basePadding,
          paddingRight: basePadding,
          height,
        }}
        whileHover={{
          paddingLeft: hoverPadding,
          paddingRight: hoverPadding,
        }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
        className={`inline-block border border-[var(--foreground)] text-[var(--foreground)] font-medium ${textSize} h-[32px] ${radius} transition hover:bg-[var(--foreground)] hover:text-[var(--background)] ${className}`}
      >
        {children}
      </motion.button>
    </a>
  );
}
