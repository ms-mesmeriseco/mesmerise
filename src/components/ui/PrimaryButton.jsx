import { motion } from "framer-motion";

const SIZE_MAP = {
  small: { radius: "rounded-md  ", font: "text-sm leading-none" },
  large: { radius: "rounded-lg  ", font: "text-xl" },
  "x-large": {
    radius: "rounded-xl ",
    font: "text-5xl",
  },
};
export default function PrimaryButton({
  href = "#",
  children,
  className = "",
  size = "small", // "small" | "large" | "x-large"
  ...props
}) {
  const { radius, font } = SIZE_MAP[size] || SIZE_MAP.small;

  return (
    <motion.a
      href={href}
      whileHover={{ paddingLeft: "12px", paddingRight: "12px" }}
      transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
      className={`border-1 w-fit bg-[var(--foreground)] border-[var(--foreground)] text-[var(--background)] hover:bg-transparent hover:border-[var(--mesm-blue)] hover:text-[var(--mesm-blue)] ${font} ${radius} ${(size =
        "small"
          ? "px-2 py-1"
          : (size = "large" ? "px-3 py-1" : "px-4 py-3"))}  ${className}`}
    >
      {children}
    </motion.a>
  );
}
