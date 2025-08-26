import PrimaryButton from "@/components/ui/PrimaryButton";
import PageTitleLarge from "@/components/layout/PageTitleLarge";
import Link from "next/link";

const offerings = [
  {
    title: "Defined",
    subheading:
      "A fixed-scope engagement designed for specific, time-bound initiatives. Perfect when you need clarity, precision, and predictable delivery on a clearly defined project.",
    cta: { label: "Learn more", href: "/defined" },
  },
  {
    title: "Ongoing",
    subheading:
      "An ongoing partnership built for continuous growth. Ideal when you want a trusted team by your side, evolving strategies, optimising campaigns, and supporting your ambitions over time.",
    cta: { label: "Learn more", href: "/perpetual" },
  },
];

export default function CollabModel() {
  return (
    <section data-marker="how we work" className="py-24 text-center">
      <PageTitleLarge text="Collaboration Models" />
      <br />
      <div className="flex flex-col md:flex-row justify-center h-[60vh] items-stretch gap-[var(--global-margin-xs)]">
        {offerings.map((pkg) => (
          <div
            key={pkg.title}
            className=" flex-col flex gap-[4rem] justify-between border border-[var(--mesm-grey)] hover:border-[var(--foreground)] duration-200 p-[var(--global-margin-md)] text-left rounded-md bg-[var(--background)] text-[var(--foreground)]"
          >
            <h3 className="page-title-large font-bold w-1/2">{pkg.title}</h3>
            <div>
              <p className="text-base p2">{pkg.subheading}</p>
              <br />
              <div className="w-full flex justify-end">
                <Link
                  href={pkg.cta.href}
                  size="large"
                  className="hover:text-[var(--mesm-blue)] duration-200 text-3xl opacity-70 hover:opacity-100"
                >
                  {pkg.cta.label}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
