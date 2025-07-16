import StaticTwoColumn from "@/components/layout/StaticTwoColumn";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function AboutSection() {
  return (
    <section data-marker="what we're about" className="h-[80vh] flex items-center">
      <StaticTwoColumn
        column1={[
          <h2 key="title" className="text-4xl md:text-6xl">
            Mesmerise—where creative thinking meets marketing science.
          </h2>,
           <p key="desc" className="max-w-xl">
            We blend smart data with bold design to deliver work that doesn’t just look good, it performs.
          </p>,
          <PrimaryButton  key="button" href="/connect">Connect</PrimaryButton>,
        ]}
      />
    </section>
  );
}
