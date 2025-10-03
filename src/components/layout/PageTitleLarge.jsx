import StaggeredWords from "@/hooks/StaggeredWords";
export default function PageTitleLarge({ text, center }) {
  const textAlign = [center ? "text-center" : "text-left"];
  return (
    <div
      className={`flex justify-start items-end pt-36 border-b-1 border-[var(--mesm-grey-dk)] h-full mb-6 ${textAlign}`}
    >
      <StaggeredWords
        as="h1"
        text={text}
        className=" page-title-xl mb-2 text-2xl md:text-4xl leading-tight"
      />
    </div>
  );
}
