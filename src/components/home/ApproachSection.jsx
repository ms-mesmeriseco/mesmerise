import StaticTwoColumn from "../layout/StaticTwoColumn";

export default function ApproachSection() {
  return (
    <section
      data-marker="our approach"
      className={`grid grid-cols-[1fr_1fr] gap-[var(--global-margin-lg)] border-b-1 border-[var(--mesm-grey-dk)] py-[var(--global-margin-sm)] h-[80vh]`}
    >
      <div className="flex flex-col justify-center gap-6">
        {" "}
        <div className="flex flex-col gap-6">
          <h3 className="font-bold">
            Complexity to clarity.
            <br />
            Vision to Reality.
          </h3>
          <p>
            We immerse ourselves in your goals, uncovering the heart of your
            challenges and ambitions. Building not only growth, but lasting
            value that inspires the people who matter most to your mission.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-6 p-[var(--global-margin-md)]">
        {" "}
        <div className="flex flex-col gap-6 bg-yellow-300 p-6 rounded-md h-full"></div>
      </div>
    </section>
  );
}
