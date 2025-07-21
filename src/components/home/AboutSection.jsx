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
              Not just another marketing agency.
            </h1>
            <p>
              We blend smart data with bold design to deliver work that
              doesn&apos;t just look good, it performs.
            </p>
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
