import StaticTwoColumn from "@/components/layout/StaticTwoColumn";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function AboutSection() {
  return (
    <section className="flex items-center  border-b-1 pb-[var(--global-margin-lg)]">
      <StaticTwoColumn
        label={"what we're about"}
        column1={[
          <h1 key="title" className="text-md md:text-6xl">
            Not just another marketing agency.
          </h1>,
          <p key="desc" className="max-w-xl">
            We blend smart data with bold design to deliver work that doesn’t
            just look good, it performs.
          </p>,
          <PrimaryButton key="button" href="/connect">
            Connect
          </PrimaryButton>,
        ]}
        columns={["2fr 1fr"]}
      />
    </section>
  );
}
