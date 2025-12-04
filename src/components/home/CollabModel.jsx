import Button from "../ui/Button";
import InView from "@/hooks/InView";
import Link from "next/link";

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
    <section data-marker="how we work" className="py-24 flex flex-col h-full">
      <InView>
        <h6>Collaboration Models</h6>
        {/* <PageTitleMedium text="Collaboration Models" center /> */}

        <div className="grid md:grid-cols-2 justify-center items-stretch gap-[var(--global-margin-xs)]  border-t m-0 border-b border-[var(--mesm-grey-dk)] py-4">
          {offerings.map((pkg) => (
            <Link key={pkg.title} href={pkg.cta.href}>
              <div className="min-h-[50vh]  flex-col flex gap-[4rem] justify-between border border-[var(--mesm-grey-dk)] hover:border-[var(--mesm-yellow)] duration-200 p-[var(--global-margin-md)] text-left rounded-md bg-[var(--background)] hover:bg-[var(--mesm-yellow)] text-[var(--foreground)] hover:text-[var(--background)] cursor-pointer">
                <h3 className="page-title-medium font-bold w-1/2">
                  {pkg.title}
                </h3>
                <div>
                  <p className="text-base opacity-50 hover:opacity-100 duration-200">
                    {pkg.subheading}
                  </p>
                  <br />
                  {/* <div className="w-full flex justify-end">
                    <Button
                      href={pkg.cta.href}
                      size="large"
                      variant="secondary"
                    >
                      {pkg.cta.label}
                    </Button>
                  </div> */}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </InView>
    </section>
  );
}
