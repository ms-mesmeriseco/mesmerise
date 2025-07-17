export default function StaticTwoColumn({ column1, column2, columns }) {
  return (
    <section
      className={`grid grid-cols-[2fr_1fr] gap-[var(--global-margin-lg)] h-100`}
    >
      <div className="flex flex-col justify-center gap-6">{column1}</div>
      <div className="flex flex-col justify-center gap-6">{column2}</div>
    </section>
  );
}
