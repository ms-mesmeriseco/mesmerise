import StaggeredWords from "@/hooks/StaggeredWords";

export default function PageTitleMedium({ text, center }) {
  const textAlign = [center ? "text-center" : "text-left"];
  return (
    <div
      className={`flex justify-start items-end pt-24 w-full pb-8 ${textAlign}`}
    >
      <StaggeredWords
        text={text}
        as="h2"
        className="font-normal page-title-medium w-full"
      />
    </div>
  );
}
