import PrimaryButton from "@/components/ui/PrimaryButton";
import Link from "next/link";

const offerings = [
  {
    title: "Defined",
    subheading:
      "A fixed-scope engagement designed for specific, time-bound initiatives. Perfect when you need clarity, precision, and predictable delivery on a clearly defined project.",
    cta: { label: "Learn more", href: "/collaboration/defined" },
  },
  {
    title: "Perpetual",
    subheading:
      "An ongoing partnership built for continuous growth. Ideal when you want a trusted team by your side, evolving strategies, optimising campaigns, and supporting your ambitions over time.",
    cta: { label: "Learn more", href: "/collaboration/perpetual" },
  },
];

export default function CollabModel() {
  return (
    <section data-marker="how we work" className="py-24 text-center">

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-[var(--global-margin-xs)]">
        {offerings.map((pkg) => (
          <div
            key={pkg.title}
            className=" flex-col flex gap-[4rem] justify-between border border-[var(--mesm-grey)] p-[var(--global-margin-md)] text-left rounded-md bg-[var(--background)] text-[var(--foreground)]"
          >
            <h3 className="text-2xl font-bold w-1/2">{pkg.title}</h3>
            <p className="text-base opacity-80 w-1/2">{pkg.subheading}</p>

            <a href={pkg.cta.href} size="large">
              {pkg.cta.label}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
