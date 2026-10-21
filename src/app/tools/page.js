import Link from "next/link";
import Image from "next/image";
import PageTitleLarge from "@/components/ui/PageTitleLarge";
import { DEFAULT_OG_IMAGE_URL, absoluteUrl } from "@/lib/seo";
import InView from "@/hooks/InView";
import StaggeredWords from "@/hooks/StaggeredWords";
import HeroButton from "@/components/ui/HeroButton";

// Draft: kept out of search until the page is signed off
export async function generateMetadata() {
  const title = "Free Marketing Tools | Mesmerise";
  const description =
    "Free diagnostics to find where your marketing is leaking and how your function benchmarks against the best.";
  const canonicalUrl = absoluteUrl("/tools");

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        { url: DEFAULT_OG_IMAGE_URL, width: 1200, height: 630, alt: title },
      ],
    },
  };
}

// Drop a background image into /public/assets/tools and set `image` to its path
const TOOLS = [
  {
    href: "/growth-leak-audit",
    title: "Growth Leak Audit",
    image: "/assets/tools-covers/growth-leak-audit.png",
    meta: ["4 minutes", "For business owners"],
  },
  {
    href: "/cmo-benchmark",
    title: "Marketing Leadership Benchmark",
    image: "/assets/tools-covers/cmo-benchmark.png",
    meta: ["7 minutes", "For marketing leaders"],
  },
];

function ToolCard({ href, title, image, meta }) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-end md:aspect-[16/9] aspect-[5/4] overflow-hidden rounded-lg border-1 border-[var(--mesm-grey)] hover:border-[var(--mesm-grey)] duration-200 bg-[var(--accent2)]/20"
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover opacity-40 group-hover:scale-[1.03] duration-500"
      />

      {/* Shade the bottom so the meta text stays readable on any image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

      <div className="relative flex items-end justify-between gap-4 p-4 md:p-6">
        <div className="flex flex-col items-start gap-2">
          <span className="border-1 border-[var(--mesm-grey-dk)] text-[var(--foreground)] px-4 py-1 rounded-xl bg-[var(--background)] group-hover:bg-[var(--accent2)]/90 group-hover:text-black text-2xl duration-400">
            {title}
          </span>
          <ul className="flex flex-wrap gap-x-6 py-4 no-list">
            {meta.map((item) => (
              <li key={item} className="text-sm text-white/80 no-list px-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Link>
  );
}

function FinalCTA({ text }) {
  return (
    <InView>
      <section className="flex flex-col justify-center text-[var(--foreground)] min-h-screen py-24 text-center items-center gap-12">
        <StaggeredWords as="h3" text={text} className="page-title-large" />

        <HeroButton size="lg" href="/connect">
          <span className="page-title-small">Let's Talk</span>
        </HeroButton>
      </section>
    </InView>
  );
}

export default function Tools() {
  return (
    <section className="pb-32">
      <PageTitleLarge text="Tools" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>

      <FinalCTA text="Premium full service solutions, engineered with insight. Delivered with intent."></FinalCTA>
    </section>
  );
}
