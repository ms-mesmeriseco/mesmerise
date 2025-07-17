import { motion } from "framer-motion";

export default function SecondaryButton({
  href = "#",
  children,
  className = "",
  ...props
}) {
  return (
    <a href={href} {...props}>
      <motion.button
        style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
        whileHover={{ paddingLeft: "1rem", paddingRight: "1rem" }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
        className={`inline-block border border-[var(--foreground)] text-[var(--foreground)] font-medium text-base h-[32px] rounded-md transition hover:bg-[var(--foreground)] hover:text-[var(--background)] ${className}`}
      >
        {children}
      </motion.button>
    </a>
  );
}
