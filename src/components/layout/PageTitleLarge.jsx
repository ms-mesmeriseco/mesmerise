import StaggeredWords from "@/hooks/StaggeredWords";
export default function PageTitleLarge({ text, center }) {
  const textAlign = [center ? "text-center" : "text-left"];
  return (
    <div
      className={`flex justify-start items-end pt-36 border-b-1 border-[var(--mesm-l-grey)] h-full ${textAlign}`}
    >
      <StaggeredWords as="h1" text={text} className=" page-title-large" />
    </div>
  );
}
