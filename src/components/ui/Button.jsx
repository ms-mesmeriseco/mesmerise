"use client";

const SIZE_MAP = {
  small: {
    radius: "rounded-lg hover:rounded-md",
    font: "md:text-sm text-xs leading-none",
    px: "px-2",
    py: "py-1",
  },
  large: {
    radius: "rounded-xl hover:rounded-lg",
    font: "text-lg",
    px: "px-3",
    py: "py-[3.8]",
  },
  "x-large": {
    radius: "hover:rounded-2xl rounded-3xl",
    font: "md:text-5xl text-3xl",
    px: "md:px-7 px-4",
    py: "md:py-3 py-2",
  },
  none: { radius: "", font: "text-3xl font-normal", px: "px-0", py: "py-0" },
};

const VARIANTS = {
  primary:
    "bg-[var(--mesm-blue)] border-[var(--mesm-blue)] text-[var(--background)] ",
  // "hover:bg-transparent hover:border-[var(--mesm-blue)] hover:text-[var(--mesm-blue)]",
  secondary:
    "bg-transparent border-[var(--mesm-grey-dk)] text-[var(--mesm-l-grey)] ",
  // "hover:bg-[var(--foreground)] hover:text-[var(--background)]",
  accent:
    "bg-[var(--accent)]/92 border-[var(--accent)]/100 text-[var(--background)]/98 ",
  // "hover:bg-[var(--accent)]/15 hover:text-[var(--accent)] duration-200",
  accent2:
    "bg-[var(--accent2)]/98 border-[var(--accent2)]/100 text-[var(--background)]/98 ",
  // "hover:bg-[var(--accent2)]/15 hover:text-[var(--accent2)] duration-200",
  CTA: "justify-center rounded-[1.1rem] text-center shadow-lg shadow-[#686767]/30  w-full bg-[var(--accent)] border-[var(--mesm-grey-dk)] text-[var(--background)]",

  // "hover:bg-[var(--accent2)]/15 hover:text-[var(--accent2)]",
};

export default function Button({
  href = "#",
  children,
  extraClass = "",
  size = "small",
  variant = "primary",
  ...props
}) {
  const cfg = SIZE_MAP[size] ?? SIZE_MAP.small;
  const variantClasses = VARIANTS[variant] ?? VARIANTS.primary;

  return (
    <a
      href={href}
      className={[
        "inline-block select-none border w-fit",
        "hover:bg-[var(--mesm-grey-dk)]/40 hover:border-[var(--mesm-grey)] hover:text-[var(--mesm-l-grey)]",
        cfg.radius,
        cfg.font,
        cfg.px,
        cfg.py,
        variantClasses,
        extraClass,
        // buttery-smooth hover with GPU acceleration
        "duration-150 ease-out",
        "", // or scale-x-[1.03] for horizontal-only
      ].join(" ")}
      {...props}
    >
      {children}
    </a>
  );
}
