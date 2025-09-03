import { motion } from "framer-motion";

export default function SecondaryButton({
  href = "#",
  children,
  className = "",
  size = "small", // "small" | "large" | "x-large"
  ...props
}) {
  const SIZE_MAP = {
    small: { radius: "rounded-md  ", font: "text-sm leading-none" },
    large: { radius: "rounded-lg  ", font: "text-xl" },
    "x-large": {
      radius: "rounded-xl ",
      font: "text-5xl",
    },
  };

  const { radius, font } = SIZE_MAP[size] || SIZE_MAP.small;

  return (
    <motion.a
      href={href}
      whileHover={{ paddingLeft: "16px", paddingRight: "16px" }}
      transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
      className={`w-fit text-[var(--foreground)] border-[var(--foreground)] border-1 ${font} ${radius}transition hover:bg-[var(--mesm-blue)] hover:border-[var(--mesm-blue)] hover:text-[var(--background)] ${(size =
        "small"
          ? "px-2 py-1"
          : (size = "large" ? "px-3 py-1" : "px-4 py-3"))}  ${className}`}
      {...props}
    >
      {children}
    </motion.a>
  );
}
