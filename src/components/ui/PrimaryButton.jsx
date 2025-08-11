import { motion } from "framer-motion";

export default function PrimaryButton({
  href = "#",
  children,
  size = "small",
  extraClass = "",
  ...props
}) {
  const isLarge = size === "large";
  const basePadding = isLarge ? "1.5rem" : "1.5rem";
  const hoverPadding = isLarge ? "2.7rem" : "2rem";
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
      }}
      whileHover={{
        paddingLeft: hoverPadding,
        paddingRight: hoverPadding,
      }}
      transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
      className={`w-fit bg-[var(--foreground)] text-sm text-[var(--background)] font-medium ${radius} transition ${extraClass}`}
      {...props}
    >
      {children}
    </motion.a>
  );
}
