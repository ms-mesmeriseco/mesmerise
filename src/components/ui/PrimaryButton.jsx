import { motion } from "framer-motion";

export default function PrimaryButton({
  href = "#",
  children,
  className = "",
  size = "small", // default to "small"
  ...props
}) {
  const isLarge = size === "large";

  const basePadding = isLarge ? "2.5rem" : "2rem";
  const hoverPadding = isLarge ? "3.5rem" : "2.5rem";
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
        className={`inline-block w-fit bg-[var(--foreground)] text-[var(--background)] font-medium ${radius} transition hover:opacity-90 ${textSize} ${className}`}
      >
        {children}
      </motion.button>
    </a>
  );
}
