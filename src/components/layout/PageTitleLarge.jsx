export default function PageTitleLarge({ text }) {
  return (
    <div className="flex justify-start items-end h-[30vh] border-b-1 border-[var(--foreground)]">
      <h1 className="font-normal page-title-large">{text}</h1>
    </div>
  );
}
