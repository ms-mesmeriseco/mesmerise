import PrimaryButton from "@/components/ui/PrimaryButton";

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
    <section
      data-marker="how we work"
      className="py-24 text-center px-[var(--global-margin-lg)]"
    >
      <h2 className="text-4xl md:text-6xl mb-20">Collaboration Models</h2>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-[var(--global-margin-sm)]">
        {offerings.map((pkg) => (
          <div
            key={pkg.title}
            className=" flex-col flex gap-[var(--global-margin-md)] justify-between w-[300px] md:w-[360px] border border-[var(--foreground)] p-[var(--global-margin-md)] text-left rounded-xl bg-[var(--background)] text-[var(--foreground)]"
          >
            <h3 className="text-2xl font-bold">{pkg.title}</h3>
            <p className="text-base opacity-80">{pkg.subheading}</p>

            <PrimaryButton href={pkg.cta.href} className="">
              {pkg.cta.label}
            </PrimaryButton>
          </div>
        ))}
      </div>
    </section>
  );
}
