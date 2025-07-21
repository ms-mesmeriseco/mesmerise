import StaticTwoColumn from "../layout/StaticTwoColumn";

export default function ApproachSection() {
  return (
    <section
      data-marker="our approach"
      className={`grid grid-cols-[1fr_1fr] gap-[var(--global-margin-lg)] border-b-1 border-[var(--mesm-grey)] py-[var(--global-margin-sm)] h-[80vh]`}
    >
      <div className="flex flex-col justify-center gap-6">
        {" "}
        <div className="flex flex-col gap-6">
          <h3 className="page-title-large font-bold">
            Complexity to clarity.
            <br />
            Vision to Reality.
          </h3>
          <p>
            We immerse ourselves in your goals, uncovering the heart of your
            challenges and ambitions. Then,{" "}
            <strong>
              we craft a tailored, state-of-the-art approach that unites
              strategy, design, and marketing into one cohesive ecosystem.
            </strong>
            <br />
            From insights that spark momentum, to creative that captivates and
            omnipresent campaigns that Mesmerise, we deliver scalable solutions
            that evolve with your vision. At every step, we stand as your
            trusted partner.{" "}
            <strong>
              Building not only growth, but lasting value that inspires the
              people who matter most to your mission.
            </strong>
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-6 p-[var(--global-margin-lg)]">
        {" "}
        <div className="flex flex-col gap-6 bg-yellow-300 p-6 rounded-md h-full"></div>
      </div>
    </section>
  );
}
