import Button from "../ui/Button";

const offerings = [
  {
    title: "Defined",
    subheading:
      "A fixed-scope engagement designed for specific, time-bound initiatives. Perfect when you need clarity, precision, and predictable delivery on a clearly defined project.",
    cta: { label: "Learn more", href: "/collaboration/defined" },
  },
  {
    title: "Continuous",
    subheading:
      "An ongoing partnership built for continuous growth. Ideal when you want a trusted team by your side, evolving strategies, optimising campaigns, and supporting your ambitions over time.",
    cta: { label: "Learn more", href: "/collaboration/continuous" },
  },
];

export default function CollabModel() {
  return (
    <section data-marker="how we work" className="py-24 flex flex-col">
      <h6>Collaboration Models</h6>
      {/* <PageTitleMedium text="Collaboration Models" center /> */}

      <div className="grid md:grid-cols-2 justify-center items-stretch gap-[var(--global-margin-xs)]  border-t border-b border-[var(--mesm-grey-dk)] py-6">
        {offerings.map((pkg) => (
          <div
            key={pkg.title}
            className="md:h-[50vh] h-[40vh] flex-col flex gap-[4rem] justify-between border border-[var(--mesm-grey-dk)] hover:border-[var(--foreground)] duration-200 p-[var(--global-margin-md)] text-left rounded-md bg-[var(--background)] text-[var(--foreground)]"
          >
            <h3 className="page-title-medium font-bold w-1/2">{pkg.title}</h3>
            <div>
              <p className="text-base p2 opacity-50 hover:opacity-100 duration-200">
                {pkg.subheading}
              </p>
              <br />
              <div className="w-full flex justify-end">
                <Button href={pkg.cta.href} size="large" variant="secondary">
                  {pkg.cta.label}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
