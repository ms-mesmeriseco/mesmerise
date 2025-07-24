import StaticTwoColumn from "@/components/layout/StaticTwoColumn";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function AboutSection() {
  return (
    <section className="flex items-center border-b-1 border-[var(--mesm-grey)] pb-[var(--global-margin-lg)]">
      <StaticTwoColumn
        label="what we're about"
        column1={
          <>
            <h1 className="text-md md:text-6xl">
              Mesmerise is a bespoke digital agency. We work end-to-end, from
              website to strategy, to growth and performance.
            </h1>

            <PrimaryButton href="/connect" size="large">
              Connect
            </PrimaryButton>
          </>
        }
        column2={null}
      />
    </section>
  );
}
