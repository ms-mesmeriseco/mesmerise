"use client";

const SIZE_MAP = {
  small: ["text-sm md:text-md leading-none", "px-4 py-1"].join(" "),
  large: ["text-xl leading-tight", "px-4 py-2"].join(" "),
  "x-large": ["text-3xl md:text-5xl", "px-4 md:px-7 py-2 md:py-3"].join(" "),
  none: ["text-3xl font-normal", "px-0 py-0"].join(" "),
};

const VARIANTS = {
  primary:
    "bg-[var(--mesm-blue)] border-[var(--mesm-blue)] text-[var(--background)]",
  secondary:
    "bg-transparent border-[var(--mesm-grey-dk)] text-[var(--mesm-l-grey)]",
  accent:
    "bg-[var(--accent)]/92 border-[var(--accent)]/100 text-[var(--background)]/98",
  accent2:
    "bg-[var(--accent2)]/98 border-[var(--accent2)]/100 text-[var(--background)]/98",
  CTA: "bg-[var(--accent)] border-[var(--mesm-grey-dk)] text-[var(--background)] shadow-lg shadow-[#686767]/30 w-full h-[52px]",
};

// Diagonal ↗ arrow, drawn in the text colour
const ArrowIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={`absolute inset-0 w-full h-full duration-300 ease-out motion-reduce:transition-none ${className}`}
  >
    <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
  </svg>
);

// On hover the arrow leaves through the top right while a copy enters from
// the bottom left
const AnimatedArrow = () => (
  <span className="relative inline-block w-[0.8em] h-[0.8em] ml-2 overflow-hidden shrink-0">
    <ArrowIcon className="group-hover:translate-x-full group-hover:-translate-y-full" />
    <ArrowIcon className="-translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0" />
  </span>
);

// arrow: adds the animated diagonal arrow after the label
export default function Button({
  href = "#",
  children,
  extraClass = "",
  size = "small",
  variant = "primary",
  arrow = false,
  ...props
}) {
  const sizeClasses = SIZE_MAP[size] ?? SIZE_MAP.small;
  const variantClasses = VARIANTS[variant] ?? VARIANTS.primary;
  const isCTA = variant === "CTA";

  return (
    <a
      href={href}
      className={[
        // base layout
        "group inline-flex items-center justify-center select-none border whitespace-nowrap",
        "duration-150 ease-out",
        "rounded-2xl hover:rounded-xl",
        // default width vs CTA full-width
        isCTA ? "w-full h-[48px] text-center" : "w-fit",
        // shared hover
        "hover:bg-[var(--mesm-grey-dk)]/40 hover:border-[var(--mesm-grey)] hover:text-[var(--mesm-l-grey)]",
        // sizing + variant styling
        sizeClasses,
        variantClasses,
        // custom overrides
        extraClass,
      ].join(" ")}
      {...props}
    >
      {children}
      {arrow && <AnimatedArrow />}
    </a>
  );
}
