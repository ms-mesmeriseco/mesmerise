export default function PageTitleLarge({ text, center }) {
  const textAlign = [center ? "text-center" : "text-left"];
  return (
    <div
      className={`flex justify-start items-end pt-36 border-b-1 border-[var(--foreground)] ${textAlign}`}
    >
      <h1 className="font-normal page-title-large">{text}</h1>
    </div>
  );
}
