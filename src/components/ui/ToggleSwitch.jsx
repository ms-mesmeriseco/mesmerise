export default function ToggleSwitch({ options = [], value, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-[var(--mesm-grey-xd)] rounded-lg p-1 border border-1 border-[var(--mesm-grey-dk)] w-fit mx-auto mb-8 text-sm">
      {options.map((option) => (
        <button
          key={option}
          className={`flex-1 px-4 py-1 rounded-lg transition-colors cursor-pointer ${
            value === option
              ? "bg-[var(--mesm-l-grey)] text-black"
              : "bg-transparent text-[var(--foreground)]"
          }`}
          onClick={() => onChange(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
