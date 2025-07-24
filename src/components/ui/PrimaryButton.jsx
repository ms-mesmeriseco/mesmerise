import { motion } from "framer-motion";

export default function PrimaryButton({
  href = "#",
  children,
  className = "",
  size = "small", // default to "small"
  ...props
}) {
  const isLarge = size === "large";

  const basePadding = isLarge ? "2rem" : "1.5rem";
  const hoverPadding = isLarge ? "2.7rem" : "2rem";
  const height = isLarge ? "45px" : "32px";
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
        className={`inline-block w-fit bg-[var(--foreground)] text-sm text-[var(--background)] font-medium ${radius} transition ${className}`}
      >
        {children}
      </motion.button>
    </a>
  );
}
