export default function ToggleSwitch({
  options = [],
  value,
  onChange,
  selectedBg = "var(--accent2)", // CSS color for the ACTIVE button
  selectedTextClass = "text-black", // Tailwind text class for ACTIVE state
  textSize = "sm", // "xs" | "sm" | "base" | "lg" | "xl"
  className = "",
}) {
  const sizeClass =
    {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    }[textSize] || "text-sm";

  return (
    <div
      className={[
        "flex items-center gap-2",
        "bg-[var(--mesm-grey-dk)]/5",
        "rounded-2xl p-1",
        "border border-[var(--mesm-grey-dk)]",
        "w-fit mx-auto mb-8",
        "shadow-xl backdrop-blur-xs",
        sizeClass,
        className,
      ].join(" ")}
    >
      {options.map((option) => {
        const isActive = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={isActive}
            className={[
              "flex-1 px-4 py-1 rounded-xl transition-colors cursor-pointer focus:outline-none border-1 border-transparent hover:border-[var(--mesm-grey)]",
              isActive ? selectedTextClass : "text-[var(--foreground)]",
            ].join(" ")}
            style={isActive ? { backgroundColor: selectedBg } : undefined}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
