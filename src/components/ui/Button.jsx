"use client";

const SIZE_MAP = {
  small: ["text-xs md:text-sm leading-none", "px-2 py-1"].join(" "),
  large: ["text-base leading-tight", "px-3 py-2"].join(" "),
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
  CTA: "bg-[var(--accent)] border-[var(--mesm-grey-dk)] text-[var(--background)] shadow-lg shadow-[#686767]/30",
};

export default function Button({
  href = "#",
  children,
  extraClass = "",
  size = "small",
  variant = "primary",
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
        "inline-flex items-center justify-center select-none border whitespace-nowrap",
        "duration-150 ease-out",
        "rounded-2xl hover:rounded-xl",
        // default width vs CTA full-width
        isCTA ? "w-full h-[48px] text-center" : "w-full",
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
    </a>
  );
}
