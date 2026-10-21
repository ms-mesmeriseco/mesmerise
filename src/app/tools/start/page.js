import PageTitleLarge from "@/components/ui/PageTitleLarge";
import CtaBentoBox from "@/components/sanity-blocks/CtaBentoBox";
import { DEFAULT_OG_IMAGE_URL, absoluteUrl } from "@/lib/seo";

// Draft: kept out of search until the page is signed off
export async function generateMetadata() {
  const title = "Find the Right Tool | Mesmerise";
  const description =
    "Marketing leaders benchmark their function. Business owners find where their marketing is leaking.";
  const canonicalUrl = absoluteUrl("/tools/start");

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

const pt = (key, text, style = "normal") => ({
  _type: "block",
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
});

// Gateway: leaders go to the benchmark, business owners to the leak audit
const GATEWAY_BENTO = {
  bentoTitle: "Which best describes you?",
  ctaBox1: [
    pt("g1h", "C-suite, executives & chief marketing officers", "h3"),
    pt(
      "g1p",
      "Benchmark your marketing function across eight areas and leave with three priorities, plus the business case for each.",
    ),
  ],
  ctaLink1: "/cmo-benchmark",
  linkLabel1: "Marketing Leadership Benchmark · 7 minutes",
  ctaBox2: [
    pt("g2h", "Small to medium business owners", "h3"),
    pt(
      "g2p",
      "Find out exactly where your marketing is leaking and which fixes will win back the most revenue.",
    ),
  ],
  ctaLink2: "/growth-leak-audit",
  linkLabel2: "Growth Leak Audit · 4 minutes",
};

export default function ToolsGateway() {
  return (
    <section className="pb-32">
      <CtaBentoBox block={GATEWAY_BENTO} />
    </section>
  );
}
