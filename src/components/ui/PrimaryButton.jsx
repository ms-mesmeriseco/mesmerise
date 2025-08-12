import { motion } from "framer-motion";

const SIZES = {
  small: {
    height: 32,
    padX: 24,
    padXHover: 32,
    radius: "rounded-sm",
    text: "text-sm",
  },
  large: {
    height: 45,
    padX: 40,
    padXHover: 44,
    radius: "rounded-md",
    text: "text-base",
  },
};

export default function PrimaryButton({
  href = "#",
  children,
  size = "small",
  extraClass = "",
  ...props
}) {
  const { height, padX, padXHover, radius, text } = SIZES[size] || SIZES.small;

  return (
    <motion.a
      href={href}
      className={[
        "inline-flex items-center justify-center w-fit",
        "bg-[var(--mesm-grey-xd)]",
        "border border-[color:var(--foregound)]", // keep your var name
        "text-[color:var(--foregound)] font-medium",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
        radius,
        text,
        extraClass,
      ].join(" ")}
      style={{
        height,
        lineHeight: height + "px",
        paddingLeft: padX,
        paddingRight: padX,
      }}
      whileHover={{
        paddingLeft: padXHover,
        paddingRight: padXHover,
        borderColor: "var(--accent)",
        color: "var(--accent)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "tween", ease: [0.4, 0, 0.2, 1], duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.a>
  );
}
