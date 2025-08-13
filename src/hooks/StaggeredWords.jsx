import { motion } from "framer-motion";

export default function StaggeredWords({
  text,
  className = "",
  delay = 0.5,
  as: As = "h1",
  gradient,
}) {
  const safeText = typeof text === "string" ? text : "";
  const words = safeText.split(" ");

  return (
    <As className={className}>
      <span
        className="inline-block align-top"
        style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            className={`inline-block will-change-transform  ${
              gradient
                ? "bg-gradient-to-r from-[var(--mesm-red)] to-[var(--mesm-yellow)] bg-clip-text text-transparent"
                : ""
            }`}
            initial={{ y: "0.1em", opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.3,
              delay: delay + i * 0.06,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </span>
    </As>
  );
}
