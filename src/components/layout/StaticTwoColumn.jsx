 export default function StaticTwoColumn({ column1, column2, label }) {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 gap-[var(--global-margin-lg)]"
      data-marker={label}
    >
      <div className="w-full flex flex-col justify-center gap-6">{column1}</div>
      <div className="w-full flex flex-col justify-center gap-6">{column2}</div>
    </section>
  );
}